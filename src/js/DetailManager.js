const $ = require("jquery");

import { UIManager } from "./UIManager";

export class DetailManager extends UIManager {
    constructor(elementSelector, filmService, pubSub) {
        super(elementSelector);
        this.filmService = filmService;
        this.pubSub = pubSub;
    }

    init() {
        let filmId = localStorage.getItem("filmId");
        this.loadDetail(filmId);
        this.pubSub.subscribe("update-film", (topic, film) => {
            this.loadDetail(filmId);
        });
        console.log("Data", filmId);
    }

    loadDetail(filmId) {
        this.filmService.getDetail(filmId, (data) => {
            this.setIdeal();
            this.loadSinopsis(data);
        }, error => {
            this.setError();
            console.log("Error al cargar la información.", error);
        });
    }

    loadSinopsis(film) {
        let html = this.renderImages(film) + this.renderSinopsis(film);
        this.setIdealHtml(html);
    }


    renderImages(film) {
        let cover = "";
        let scene1 = "";
        let scene2 = "";
        if (film.cover_url) {
            cover = `<img id="cover" src="${film.cover_url}">`;
        } else {
            cover = `<img id="cover" src="./img/cover.jpg">`;
        }
        if (film.scene1) scene1 = `<img src="${film.scene1}">`;
        if (film.scene2) scene2 = `<img src="${film.scene2}">`;
        return `<div class="title-img">
        ${cover}
        ${scene1}
        ${scene2}
        </div>`;
    }

    renderSinopsis(film) {
        return `<div class="sinopsis-txt">
        <h1 class="negrita">${film.title}</h1>
        <p>&nbsp${film.sinopsis}.</p>
        <p>&nbsp;<span class="negrita">Director:</span> ${film.director}.</p>
        <p>&nbsp;<span class="negrita">Guionista:</span> ${film.script}.</p>
        <p>&nbsp;<span class="negrita">Género:</span> ${film.genre}.</p>
        <p>&nbsp;<span class="negrita">Duración:</span> ${film.length}.</p>
        <p>&nbsp;<span class="negrita">País de origen:</span> ${film.country}.</p>
        <p>&nbsp;<span class="negrita">Fecha de estreno:</span> ${film.debut}.</p>
        <p>&nbsp;<span class="negrita">Reparto:</span> ${film.cast}.</p>
        <p id="enlaces" class="cursiva">
        <a href="${film.filmaffinity_url}" target="_blank">FilmAffinity</a>
        <a href="${film.imdb_url}" target="_blank">IMDb</a>
        <a href="${film.tomatoes_url}" target="_blank">Rotten Tomatoes</a>
        <a href="${film.metacritic_url}" target="_blank">Metacritic</a>
        </p>
        </div>`
    }
}