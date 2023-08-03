package com.linkedin.collectibles.beans;

public enum ProductCategory {

    ALL(0), APRON(1), MUG(3), SHIRT(4), HAT(5), NOTEBOOK(6), PILLOW(7), CARD(8), ARTWORK(9), BAG(10);

    private final Integer id;

    public Integer getId() {
        return id;
    }

     ProductCategory(Integer id){
        this.id = id;
    }
}
