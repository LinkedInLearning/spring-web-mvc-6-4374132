package com.linkedin.collectibles.beans;

import java.util.Arrays;
import java.util.List;

public class Filter {

    private List<String> productType;
    private List<String> selectedType;

    public Filter(){
        this.productType = Arrays.asList("ALL", "HAT", "MUG", "BAG", "SHIRT", "ARTWORK", "PILLOW", "APRON", "NOTEBOOK", "CARD");
    }
    public List<String> getProductType() {
        return productType;
    }

    public void setProductType(List<String> productType) {
        this.productType = productType;
    }

    public List<String> getSelectedType() {
        return selectedType;
    }

    public void setSelectedType(List<String> selectedType) {
        this.selectedType = selectedType;
    }
}
