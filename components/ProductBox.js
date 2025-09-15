import styled from "styled-components";
import Button from "@/components/Button";
import CartIcon from "@/components/icons/CartIcon";
import HeartIcon from "@/components/icons/Heart";
import Link from "next/link";
import {useContext} from "react";
import {CartContext} from "@/components/CartContext";
import {useWishlist} from "@/components/WishlistContext";
import toast from "react-hot-toast";

const ProductWrapper = styled.div`
  position: relative;
`;

const WishlistButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.1);
  }
  
  svg {
    color: ${props => props.filled ? '#e74c3c' : '#666'};
    transition: color 0.2s;
  }
`;

const WhiteBox = styled(Link)`
  background-color: #fff;
  padding: 20px;
  height: 120px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img{
    max-width: 100%;
    max-height: 80px;
  }
`;

const Title = styled(Link)`
  font-weight: normal;
  font-size:.9rem;
  color:inherit;
  text-decoration:none;
  margin:0;
`;

const ProductInfoBox = styled.div`
  margin-top: 5px;
`;

const PriceRow = styled.div`
  display: block;
  @media screen and (min-width: 768px) {
    display: flex;
    gap: 5px;
  }
  align-items: center;
  justify-content:space-between;
  margin-top:2px;
`;

const Price = styled.div`
  font-size: 1rem;
  font-weight:400;
  text-align: right;
  @media screen and (min-width: 768px) {
    font-size: 1.2rem;
    font-weight:600;
    text-align: left;
  }
`;

export default function ProductBox({_id,title,description,price,images}) {
  
  const {addProduct} = useContext(CartContext);
  const {addToWishlist, removeFromWishlist, isInWishlist} = useWishlist();
  const url = '/product/'+_id;
  const inWishlist = isInWishlist(_id);

  const handleAddToCart = () => {
    addProduct(_id);
    toast.success(`${title} е добавен в кошницата!`, {
      icon: '🛒',
      duration: 3000,
    });
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWishlist) {
      removeFromWishlist(_id);
      toast.success(`${title} е премахнат от желаните!`, {
        icon: '💔',
        duration: 3000,
      });
    } else {
      addToWishlist(_id);
      toast.success(`${title} е добавен в желаните!`, {
        icon: '❤️',
        duration: 3000,
      });
    }
  };

  return (
    <ProductWrapper>
      <WishlistButton 
        filled={inWishlist}
        onClick={handleWishlistClick}
        title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <HeartIcon filled={inWishlist} className="w-5 h-5" />
      </WishlistButton>
      <WhiteBox href={url}>
        <div>
          <img src={images?.[0]} alt=""/>
        </div>
      </WhiteBox>
      <ProductInfoBox>
        <Title href={url}>{title}</Title>
        <PriceRow>
          <Price>
            ${price}
          </Price>
          <Button block onClick={handleAddToCart} primary outline>
            Добави в кошница
          </Button>
        </PriceRow>
      </ProductInfoBox>
    </ProductWrapper>
  );
}