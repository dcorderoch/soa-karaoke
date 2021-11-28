import { AfterViewInit, Component, OnInit } from "@angular/core";
import { SongService } from "src/app/services/song.service";
import { Router } from "@angular/router";
import { Filter } from "src/app/models/filter";

import Swal from "sweetalert2";
import { AuthService } from "src/app/services/auth.service";
import { Dashboard } from "src/app/models/dashboard";

@Component({
  selector: "app-songs",
  templateUrl: "./songs.component.html",
  styleUrls: ["./songs.component.css"],
})
export class SongsComponent implements AfterViewInit, OnInit {
  songs;
  filtro;
  value;

  user: any;
  dashboard = new Dashboard();
  constructor(
    private router: Router,
    public songService: SongService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem("user")) {
      this.user = JSON.parse(localStorage.getItem("user") || "{}");
    } else {
      this.router.navigate(["login"]);
    }
    this.songService.getSongs().subscribe((res) => {
      this.songs = Array.of(res.json())[0].songs;
    });
  }
  ngAfterViewInit() {
    this.authService.getDashboard(this.user.username).subscribe((res) => {
      this.dashboard = Array.of(res.json())[0].dashboard;
    });
  }
  viewSong(id) {
    let url = "song/" + id;
    this.router.navigate([url]);
  }
  sinFiltro() {
    this.filtro = "";
    this.songService.getSongs().subscribe((res) => {
      this.songs = Array.of(res.json())[0].songs;
    });
  }
  delete(song) {
    this.songService.deleteSong(song).subscribe((res) => {
      this.songs = Array.of(res.json())[0].songs;
    });
  }
  logout() {
    this.authService.logOut(this.user).subscribe(
      (data) => {
        localStorage.clear();
        this.router.navigate(["login"]);
      },
      (error) => {
        Swal.fire({ icon: "error", title: "No se pudo cerrar sesión" });
      }
    );
  }

  getFilter() {
    const body: Filter = {
      value: this.value,
      by: this.filtro,
    };
    this.songService.getFilteredSongs(body).subscribe((res) => {
      this.songs = Array.of(res.json())[0].songs;
    });
  }

  add() {
    if (this.user.role === "premiumUser") {
      this.router.navigate(["add"]);
    } else {
      Swal.fire({
        title: "Debes ser usuario premium para agregar canciones",
        showCancelButton: true,
        confirmButtonText: "Pásate a Premium",
      }).then((result) => {
        if (result.isConfirmed) {
          this.authService.updateRole(this.user).subscribe(
            (data) => {
              Swal.fire("", "", "success");
              this.user.role = "premiumUser";
              localStorage.setItem("user", JSON.stringify(this.user));
              this.router.navigate(["songs"]);
            },
            (error) => {
              Swal.fire({ icon: "error", title: "Registro fallido" });
            }
          );
        }
      });
    }
  }
  edit(name) {
    this.router.navigate(["edit/" + name]);
  }
  addArtist(favoriteArtist, username) {
    Swal.fire({
      title: "Nombre del artista",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Agregar",
      showLoaderOnConfirm: true,
      preConfirm: (inputValue) => {
        if (inputValue) {
          if (favoriteArtist != "") {
            favoriteArtist = favoriteArtist + ", " + inputValue;
          } else {
            favoriteArtist = inputValue;
          }
          this.songService
            .addFavArtist({ listArtist: favoriteArtist }, username)
            .subscribe();
          this.dashboard.favoriteArtist = favoriteArtist;
        }
      },
    });
  }
  addSong(favoriteSong, username) {
    Swal.fire({
      title: "Nombre de la canción",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Agregar",
      showLoaderOnConfirm: true,
      preConfirm: (inputValue) => {
        if (inputValue) {
          if (favoriteSong != "") {
            favoriteSong = favoriteSong + ", " + inputValue;
          } else {
            favoriteSong = inputValue;
          }
          this.songService
            .addFavSongs({ listSongs: favoriteSong }, username)
            .subscribe();
          this.dashboard.favoriteSongs = favoriteSong;
        }
      },
    });
  }
}
