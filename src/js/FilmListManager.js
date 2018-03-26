const $ = require("jquery");

import { UIManager } from "./UIManager";

export class FilmListManager extends UIManager {
    constructor(elementSelector, filmService, pubSub) {
        super(elementSelector);
        this.filmService = filmService;
        this.pubSub = pubSub; 
    }

    init() {
        this.loadFilms();
        let self = this;
        this.element.on("click", ".cover", function() {
            localStorage.setItem("filmId", this.parentNode.dataset.id);
            location.href = "detail.html";
            console.log("Cargar detalle.", this.parentNode.dataset.id);
        });
        this.pubSub.subscribe("new-film", (topic, film) => {
            this.loadFilms();
        })
    }

    loadFilms() {
        this.filmService.list(films => {
            if(films.lenght == 0) {
                this.setEmpty();
            } else {
                this.renderFilms(films);
                this.setIdeal();
            }
        }, error => {
            this.setError();
            console.log("Error al cargar las películas.", error);
        });
    }

    renderFilms(films) {
        let html = "";
        for (let film of films) html += this.renderFilm(film);
        this.setIdealHtml(html);
    }

    renderFilm(film) {
        let cover_url = film.cover_url;
        if(cover_url === "") {
            cover_url = "./img/cover.jpg";
        };
        return `<article class="film" data-id="${film.id}">
        <img class="cover" src="${cover_url}">
        <div class="title">${film.title} (${film.debut})</div>
        <div class="director">${film.director}</div>
        </article>`;
    }
}