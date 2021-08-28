let productName;
let productImage;
let productDescription;
let productPurchaseSite;
let productModelURL;

module.exports = {productModelURL};

function SetData(id){
    switch(id){
        case 001:
            localStorage.setItem("productName", "Artisian Vase");
            localStorage.setItem("productImage","/img/Product_Thumbnails/artisian_ceramic_vase.png");
            localStorage.setItem("productDescription","Rare artisian ceramic vase");
            localStorage.setItem("productPurchaseSite","https://www.amazon.com/Handpainted-Landscapes-Portraits-Ornaments-lsxysp/dp/B08SHQR17F/ref=sr_1_9?dchild=1&keywords=antique+ceramic+vase&qid=1627733984&refinements=p_36%3A1253527011&rnid=386465011&s=home-garden&sr=1-9");
            localStorage.setItem("productModelURL","https://bafybeicolgmzduzxyx6oqx26zdgbupi66pxvacadu5ndatt46ou66y4azq.ipfs.dweb.link/artisian_vase.glb");                        
            localStorage.setItem("directSale", "false");
            break;
        case 002:
            localStorage.setItem("productName", "Leather Storage Ottoman");
            localStorage.setItem("productImage","/img/Product_Thumbnails/ottoman.png");
            localStorage.setItem("productDescription","Leather Storage Ottoman with storage");
            localStorage.setItem("productPurchaseSite","https://www.amazon.com/Lyncorn-Bonded-Leather-Storage-Ottoman/dp/B007FVJS5K/ref=sr_1_6?dchild=1&keywords=ottoman&qid=1627809874&sr=8-6");
            localStorage.setItem("productModelURL","https://bafybeihvuvyb5spefqcst4rbdh4zzw23kzii7k3bbfayydtwoaod3sflhe.ipfs.dweb.link/ottoman.glb"); 
            localStorage.setItem("directSale", "true");
            break;  
            case 003:
            localStorage.setItem("productName", "Cordoba Concert Ukulele");
            localStorage.setItem("productImage","/img/Product_Thumbnails/ukulele.png");
            localStorage.setItem("productDescription","20cm Concert Ukulele");
            localStorage.setItem("productPurchaseSite","https://www.amazon.com/Cordoba-Guitars-20CM-Ukulele-Natural/dp/B007SQZK9A/ref=sr_1_4?dchild=1&keywords=ukulele&nav_sdd=aps&pd_rd_r=b9b3e37a-78a1-4f95-8d91-204e9905450a&pd_rd_w=tveMz&pd_rd_wg=ZiRoT&pf_rd_p=989a20ae-95e8-43c4-b8c1-edad73b60920&pf_rd_r=MEMTHAP174JFWKDHFDR1&qid=1627810695&refinements=p_36%3A1253549011&s=musical-instruments&sr=1-4");
            localStorage.setItem("productModelURL","https://bafybeiht5qg2vy4ajh25rrt75ibijmxw35owrno622nrgmphc3wm2fpfaa.ipfs.dweb.link/ukulele.glb"); 
            localStorage.setItem("directSale", "false");
            break;   
            case 004:
            localStorage.setItem("productName", "Chesterfield Loveseat Sofa");
            localStorage.setItem("productImage","/img/Product_Thumbnails/Chesterfield_Loveseat_Sofa.png");
            localStorage.setItem("productDescription","White two seater sofa");
            localStorage.setItem("productPurchaseSite","https://www.amazon.com/Karen-Traditional-Chesterfield-Loveseat-Beige/dp/B07G7W33D1/ref=sr_1_7?dchild=1&keywords=victorian+sofa+white&qid=1627811508&sr=8-7");
            localStorage.setItem("productModelURL","https://bafybeihlbprw7yc4ywvqhlfhmwiyaa5pyhy5adaum6csonrl5cp3xvdcje.ipfs.dweb.link/sofa.glb"); 
            localStorage.setItem("directSale", "false");
            break;     
    }
    if(localStorage.getItem("productName") != null){
        window.open("./product.html","_self");
        console.log(localStorage.getItem("productName"));
    }
}

function GetData(){
    document.getElementById("productName").innerHTML = localStorage.getItem("productName");
    document.getElementById("productImage").src = localStorage.getItem("productImage");
    document.getElementById("productDescription").innerHTML = localStorage.getItem("productDescription");
   
    if(localStorage.getItem("directSale") == "false"){
        document.getElementById("productSite").href = localStorage.getItem("productPurchaseSite");
    }
    else{
        console.log("Direct sale");
        document.getElementById("buyButton").innerText = "Proceed to payment (Sample)"
        document.getElementById("productSite").href = "./payment.html";
    }
    console.log(loadModel());
}

function loadModel(){    
    return localStorage.getItem("productModelURL");
}



