package com.linkedin.collectibles.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class ProductController {

    @PostMapping("/search")
    public String search(){
        return "search-results";
    }
}
