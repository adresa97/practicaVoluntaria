window.$ = window.jQuery = require("jquery");

//Lista de películas

import { FilmService } from "./FilmService";
import { FilmListManager } from "./FilmListManager";
import { FilmFormManager } from "./FilmFormManager"

import PubSub from "pubsub-js";

const filmService = new FilmService("http://localhost:3100/films/");
const filmListManager = new FilmListManager(".film-list", filmService, PubSub);
const filmFormManager = new FilmFormManager(".film-form", filmService, PubSub);

filmListManager.init();
filmFormManager.init();

//Página Detalle

import { DetailManager } from "./DetailManager";
import { DetailFormManager } from "./DetailFormManager";

const detailManager = new DetailManager(".sinopsis", filmService, PubSub);
const detailFormManager = new DetailFormManager(".detail-form", filmService, PubSub);

detailManager.init();
detailFormManager.init();

//Boton editar

$(".editar").on("click", function() {
    if($(".film-form").attr("hidden") === "hidden" || $(".detail-form").attr("hidden") === "hidden") {
        $(".film-form").removeAttr("hidden");
        $(".detail-form").removeAttr("hidden");
        $(".film-list").hide();
        $(".message").hide();
        $(".sinopsis").hide();
    } else {
        $(".film-form").attr("hidden", "hidden");
        $(".detail-form").attr("hidden", "hidden");
        $(".film-list").show();
        $(".message").show();
        $(".sinopsis").show();
    }
});