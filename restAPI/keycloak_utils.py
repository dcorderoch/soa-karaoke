"""
Esta clase tiene como base, la clase keycloak_utils del siguiente repositorio:
https://github.com/dangtrinhnt/keycloak_flask/tree/master/keycloak_flask
"""

from keycloak import KeycloakAdmin, KeycloakOpenID

from local_settings import get_config


def get_admin():
    config = get_config()
    return KeycloakAdmin(
        server_url=config["SERVER_URL"],
        username=config["ADMIN_USERNAME"],
        password=config["ADMIN_PASS"],
        realm_name=config["REALM_NAME"],
        verify=True,
    )


def create_user(admin, username, email, password):
    return admin.create_user(
        {
            "email": email,
            "username": username,
            "credentials": [
                {
                    "value": password,
                    "type": "password",
                }
            ],
            "enabled": True,
        }
    )


def getSessionByUsername(admin, username):
    user_id = admin.get_user_id(username)
    sessionsList = admin.get_sessions(user_id)
    return sessionsList


def get_role_id(admin, username, rolename):
    config = get_config()
    user_id = admin.get_user_id(username)
    client_name = config["CLIENT_ID"]
    client_id = admin.get_client_id(client_name)
    available_roles = admin.get_available_client_roles_of_user(
        user_id, client_id
    )
    for role in available_roles:
        if role["name"] == rolename:
            return role["id"]
    return "Not Found"


def get_role_by_name(name):
    config = get_config()
    admin = get_admin()
    client_name = config["CLIENT_ID"]
    client_id = admin.get_client_id(client_name)
    return admin.get_client_role(client_id, name)


def get_oidc():
    config = get_config()
    return KeycloakOpenID(
        server_url=config["SERVER_URL"],
        client_id=config["CLIENT_ID"],
        realm_name=config["REALM_NAME"],
        client_secret_key=config["CLIENT_SECRET"],
        verify=True,
    )


def get_token(oidc_obj, username, password):
    try:
        return oidc_obj.token(username, password)
    except Exception as exc:
        print(f"Exception occurs: {exc}")
    return None


def check_token(access_token):
    oidc = get_oidc()
    token_info = oidc.introspect(access_token)
    if token_info.get("active"):
        return True
    return False


def get_userinfo(access_token):
    oidc = get_oidc()
    try:
        return oidc.userinfo(access_token)
    except Exception as exc:
        print(f"Exception occurs: {exc}")
    return None
