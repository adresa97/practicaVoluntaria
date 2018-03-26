const $ = require("jquery");

import { UIManager } from "./UIManager";

export class FilmFormManager extends UIManager {
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
        this.setupSubmitEventHandler();
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
        const film = {
            director: this.element.find("#director").val(),
            title: this.element.find("#title").val(),
            cover_url: this.element.find("#cover_url").val()
        };
        this.filmService.save(film, success => {
            this.pubSub.publish("new-film", film);
            this.setIdeal();
            this.resetForm();
        }, error => {
            this.setErrorHtml("Se ha producido un erro al guardar la película en el servidor.");
        });
    }

    resetForm() {
        this.element[0].reset();
    }
}