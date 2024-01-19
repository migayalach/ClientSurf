import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './details.module.css';
import { useDispatch } from 'react-redux';
import { addToCart } from "../../../../redux/actions/action"



const Details = () => {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const idUser = 1
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const imgRef = useRef(null);
  const [quantity, setQuantity] = useState(1);
  
 
  
 


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios(`http://localhost:3001/surf/product/${id}`);
        const { data } = response;
        setProduct(data.listProducts[0]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  console.log(product);

  useEffect(() => {
    if (imgRef.current) {
        const img = imgRef.current;
        const handleMouseMove = (e) => {
            const { left, top, width, height } = e.target.getBoundingClientRect();
            const x = ((e.pageX - left) / width) * 100;
            const y = ((e.pageY - top) / height) * 100;
            
            const scaleFactor = 1.4;
            img.style.transformOrigin = `${x}% ${y}%`;
            img.style.transform = `scale(${scaleFactor})`;
        };

        const handleMouseOut = () => {
            img.style.transformOrigin = 'center center';
            img.style.transform = 'scale(1)';
        };

        img.addEventListener('mousemove', handleMouseMove);
        img.addEventListener('mouseout', handleMouseOut);

        return () => {
            img.removeEventListener('mousemove', handleMouseMove);
            img.removeEventListener('mouseout', handleMouseOut);
        };
    }
}, [imgRef.current]);

        console.log(product);

        const filteredCharacteristics = Object.entries(product.characteristics || {})
    .filter(([key, value]) => value !== true);
        
    const translateColor = (spanishColor) => {
      const colorMap = {
        gris: 'grey',
        azul: 'blue',
        verde:'green',
        negro:'black'
        // Agrega más traducciones según sea necesario
      };
    
      // Devuelve el color traducido o el color original si no hay traducción disponible
      return colorMap[spanishColor.toLowerCase()] || spanishColor;
    };

    const handleSizeSelect = (size) => {
      setSelectedSize(size);
    };
  
    const handleColorSelect = (color) => {
      setSelectedColor(color);
    };
  
    const handleQuantityChange = (event) => {
      setQuantity(Number(event.target.value));
    };

    const addToCartHandler = async () => {
      try {
        console.log("idUser:", idUser); 
        console.log(product);
        await dispatch(addToCart(product.idProduct, 1, quantity, product.description));

        navigate('/cart'); 
      } catch (error) {
        console.error('Error al agregar al carrito:', error);
      }
    };
 
    


  
  return (
    
    <div>
        <div className={styles.detailsContainer}>
        <div className={styles.imgContainer}>
          <img
            ref={imgRef}
            src={product.image}
            alt="ej"
            style={{ transform: 'scale(1.2)' }} 
          />
        </div>
            <div className={styles.infoContainer}>
           
            <div className={styles.subInfoContainer1}>
              
            <h2>{product.name}</h2>
            <div className={styles.price}>
                <h2>${product.priceProduct}</h2>
                </div>
                
               
          </div>
        
            <div className={styles.description}>
              <h3>Descripcion:</h3>

            <p>{product.description}</p>
            <p>
              <div className={styles.color}>
    <strong>Color:</strong> {product.nameColor}
    </div>
    <br />
    <div className={styles.size}>
    <br />
    <strong>Talle:</strong> {product.nameSize}
    </div>
    <div className={styles.stock}>
    <strong>Stock:</strong> {product.stock > 0 ? 'Disponible' : 'Agotado'}
    </div>
  </p>
            </div>
            <div className={styles.cartButton}>
            <label htmlFor="quantityInput">Cantidad:</label>

            <select className={styles.quantityLabel}
            id="quantityInput"
            name="quantityInput"
            value={quantity}
            onChange={handleQuantityChange}
          >
            {[...Array(product.stock).keys()].map((count) => (
              <option key={count + 1} value={count + 1}>
                {count + 1}
              </option>
            ))}
          </select>
      
              <button disabled={product.stock === 0} onClick={addToCartHandler}>Añadir al carrito</button>
              

            </div>
            </div>
        </div>
            <div className={styles.politicas}>
                <p>Politicas de Cambioo</p>
            </div>

    </div>
    
  )
}

export default Details