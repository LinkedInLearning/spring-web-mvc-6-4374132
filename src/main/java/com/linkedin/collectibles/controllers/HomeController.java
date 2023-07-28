package com.linkedin.collectibles.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class HomeController {
    //Get, Post, Put, Delete
    @GetMapping("/home")
    public String displayHome(Model model){
        return "index";

    }

    @GetMapping("/getCharacter/{charname}")
    public String getCharacter(@PathVariable("charname") String charName){
        return "/characters/"+charName;
    }

    @GetMapping("/about")
    public String displayAbout(){
        return "about";
    }

    @GetMapping("/contact")
    public String displayContact(){
        return "contact-us";
    }

    @GetMapping("/seeAll/{charcollection}")
    public String seeAllCharacters(@PathVariable("charcollection") String charcollection){
        return "/characters/"+charcollection;

    }
}
