const $ = require("jquery");

import { UIManager } from "./UIManager";

export class DetailFormManager extends UIManager {
    constructor(elementSelector, filmService, pubSub) {
        super(elementSelector);
        this.filmService = filmService;
        this.pubSub = pubSub;
    }

    enableFormControls() {
        this.element.find("input", "button").attr("disabled", false);
    }

    disableFormControls() {
        this.element.find("input", "button").attr("disabled", true);
    }

    setError() {
        super.setError();
        this.enableFormControls();
    }

    setLoading() {
        super.setLoading();
        this.disableFormControls();
    }

    setIdeal() {
        super.setIdeal();
        this.enableFormControls();
    }

    init() {
        this.initialValues();
        this.pubSub.subscribe("update-film", (topic, film) => {
            this.initialValues();
        });
        this.setupSubmitEventHandler();
    }

    initialValues() {
        let filmId = localStorage.getItem("filmId");
        let self = this;
        this.filmService.getDetail(filmId, (data) => {
            self.element.find("#director").val(data.director);
            self.element.find("#title").val(data.title);
            self.element.find("#script").val(data.script);
            self.element.find("#genre").val(data.genre);
            self.element.find("#length").val(data.length);
            self.element.find("#country").val(data.country);
            self.element.find("#debut").val(data.debut);
            self.element.find("#cover_url").val(data.cover_url);
            self.element.find("#scene1").val(data.scene1);
            self.element.find("#scene2").val(data.scene2);
            self.element.find("#filmaffinity_url").val(data.filmaffinitiy_url);
            self.element.find("#IMDb_url").val(data.IMDb_url);
            self.element.find("#metacritic_url").val(data.metacritic_url);
            self.element.find("#tomatoes_url").val(data.tomatoes_url);
            self.element.find("#cast").val(data.cast);
            self.element.find("#sinopsis").val(data.sinopsis);
        }, error => {
        });
        return true;
    }

    setupSubmitEventHandler() {
        this.element.on("submit", () => {
            this.validateAndSendData();

            return false;
        });
    }

    validateAndSendData() {
        if(this.isValid()) {
            this.send();
        }
    }

    isValid() {
        const inputs = this.element.find("input");
        for(let input of inputs) {
            if(input.checkValidity() === false) {
                const errorMessage = input.validationMessage;
                input.focus();
                this.setErrorHtml(errorMessage);
                this.setError();
                return false;
            }
        }
        this.setIdeal();
        return true;
    }

    send() {
        this.setLoading();
        let filmId = localStorage.getItem("filmId");
        console.log("Error", filmId);
        const film = {
            id: filmId,
            director: this.element.find("#director").val(),
            title: this.element.find("#title").val(),
            script: this.element.find("#script").val(),
            genre: this.element.find("#genre").val(),
            length: this.element.find("#length").val(),
            country: this.element.find("#country").val(),
            debut: this.element.find("#debut").val(),
            cover_url: this.element.find("#cover_url").val(),
            scene1: this.element.find("#scene1").val(),
            scene2: this.element.find("#scene2").val(),
            filmaffinity_url: this.element.find("#filmaffinity_url").val(),
            IMDb_url: this.element.find("#IMDb_url").val(),
            tomatoes_url: this.element.find("#tomatoes_url").val(),
            metacritic_url: this.element.find("#metacritic_url").val(),
            cast: this.element.find("#cast").val(),
            sinopsis: this.element.find("#sinopsis").val()
        };
        this.filmService.save(film, success => {
            this.pubSub.publish("update-film", film);
            this.setIdeal();
            this.resetForm();
        }, error => {
            this.setErrorHtml("Se ha producido un error al guardar la película en el servidor.");
        });
    }

    resetForm() {
        this.element[0].reset();
    }
}