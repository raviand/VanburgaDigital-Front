import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  hamburgers = false;
  drinks = false;
  deserve = false;

  categories = [{
   id:1,
   name:'Hamburguesas',
   description:'Para chuparse los dedos' 
  },{
    id:2,
    name:'Bebidas',
    description:'Con algo tenes que bajar lo que te morfas!' 
   },{
    id:3,
    name:'Postre',
    description:'y... si la haces, hacela bien' 
   }]

  hamburgerMenu = [
    {id:1, name:'Doble Queso, doble carne', description:'Para comerte dos' , price:150.0, img : 'https://d1uz88p17r663j.cloudfront.net/original/8689e8d974203563ddcc9bbff91323c2_MG_CHORIZOBURGER_Main-880x660.png'},
    {id:2, name:'Simple sin gracia', description:'Solo para los ratas' , price:50.0, img : 'https://d1uz88p17r663j.cloudfront.net/original/8689e8d974203563ddcc9bbff91323c2_MG_CHORIZOBURGER_Main-880x660.png'},
    {id:3, name:'Con huevo y jamon', description:'Despues de terminarlo te tomamos la presion' , price:250.0, img : 'https://d1uz88p17r663j.cloudfront.net/original/8689e8d974203563ddcc9bbff91323c2_MG_CHORIZOBURGER_Main-880x660.png'},
    {id:4, name:'Con un solo pan media carne doble queso', description:'Disponible solo para rengos' , price:75.5, img : 'https://d1uz88p17r663j.cloudfront.net/original/8689e8d974203563ddcc9bbff91323c2_MG_CHORIZOBURGER_Main-880x660.png'},
    {id:5, name:'Hamburgues de Quinoa', description:'Neeeee mentira, de esta no tenemos, solo hamburguesas de verdad' , price:10.0, img : 'https://d1uz88p17r663j.cloudfront.net/original/8689e8d974203563ddcc9bbff91323c2_MG_CHORIZOBURGER_Main-880x660.png'}
  ]

  bebidasMenu = [
    {id:1, name:'Coca-Cola', description:'De la buena' , price:150.0, img : 'https://www.cocinista.es/download/bancorecursos/recetas/receta-introduccion-cerveza.jpg'},
    {id:2, name:'Cerveza Jainequen', description:'La original' , price:3500.0, img : 'https://www.cocinista.es/download/bancorecursos/recetas/receta-introduccion-cerveza.jpg'},
    {id:3, name:'Agua', description:'Si pedis esto viene con un cachetazo en la nuca :)' , price:150.0, img : 'https://www.cocinista.es/download/bancorecursos/recetas/receta-introduccion-cerveza.jpg'},
    {id:4, name:'Coca-Sola', description:'De la buena' , price:150.0, img : 'https://www.cocinista.es/download/bancorecursos/recetas/receta-introduccion-cerveza.jpg'}
  ]

  postreMenu = [
    {id:1, name:'Flacito', description:'Con dulce de leche o Crema' , price:150.0, img : 'https://placeralplato.com/files/2016/02/Flan-casero.jpg'},
    {id:2, name:'Brownie', description:'puede ser solo o nevado' , price:350.0, img : 'https://placeralplato.com/files/2016/02/Flan-casero.jpg'},

  ]
  constructor() { }

  ngOnInit(): void {
  }

  clickHamburger(){
    if(!this.hamburgers){
      this.drinks = false;
      this.deserve = false;
    }
    this.hamburgers = !this.hamburgers;
  }

  clickDrinks(){
    if(!this.drinks){
      this.hamburgers = false;
      this.deserve = false;
    }
    this.drinks = !this.drinks;
  }

  clickDeserves(){
    if(!this.deserve){
      this.hamburgers = false;
      this.drinks = false;
    }
    this.deserve = !this.deserve;
  }

}
