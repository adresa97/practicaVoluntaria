const $ = require("jquery");

export class FilmService {
    constructor(url) {
        this.url = url;
    }

    list(successCallback, errorCallback) {
        $.ajax({
            url: this.url,
            success: successCallback,
            error: errorCallback
        });
    }

    save(film, successCallback, errorCallback) {
        if(film.id) {
            this.update(film, successCallback, errorCallback);
        } else {
            this.create(film, successCallback, errorCallback);
        }
    }

    create(film, successCallback, errorCallback) {
        $.ajax({
            url: this.url,
            method: "post",
            data: film,
            success: successCallback,
            error: errorCallback
        });
    }

    getDetail(filmId, successCallback, errorCallback) {
        $.ajax({
            url: `${this.url}${filmId}`,
            success: successCallback,
            error: errorCallback
        });
    }

    update(film, successCallback, errorCallback) {
        $.ajax({
            url: `${this.url}${film.id}`,
            method: "put",
            data: film,
            success: successCallback,
            error: errorCallback
        });
    }

    delete(filmId, successCallback, errorCallback) {
        $.ajax({
            url: `${this.url}${filmId}`,
            method: "delete",
            success: successCallback,
            error: errorCallback
        });
    }
}