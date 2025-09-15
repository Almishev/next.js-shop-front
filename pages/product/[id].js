import Center from "@/components/Center";
import Header from "@/components/Header";
import Title from "@/components/Title";
import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import styled from "styled-components";
import WhiteBox from "@/components/WhiteBox";
import ProductImages from "@/components/ProductImages";
import Button from "@/components/Button";
import CartIcon from "@/components/icons/CartIcon";
import {useContext, useEffect, useState} from "react";
import {CartContext} from "@/components/CartContext";
import toast from "react-hot-toast";

const ColWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: .8fr 1.2fr;
  }
  gap: 40px;
  margin: 40px 0;
`;
const PriceRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;
const Price = styled.span`
  font-size: 1.4rem;
`;

const ReviewsSection = styled.section`
  margin: 40px 0 60px;
`;
const ReviewsTitle = styled.h2`
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0 0 16px;
`;
const ReviewsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  @media screen and (min-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
`;
const Card = styled(WhiteBox)`
  padding: 20px;
`;
const Stars = styled.div`
  display: flex;
  gap: 6px;
  margin: 6px 0 12px;
`;
const StarBtn = styled.button`
  border: none;
  background: transparent;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  color: ${props => props.active ? '#065f46' : '#cbd5e1'};
  padding: 0;
  transition: color .15s ease;
  &:hover { color: ${props => props.active ? '#064e3b' : '#94a3b8'}; }
`;
const InputEl = styled.input`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 10px;
`;
const TextareaEl = styled.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 12px;
  min-height: 90px;
  margin-bottom: 12px;
  resize: vertical;
`;
const SmallMuted = styled.div`
  font-size: .85rem;
  color: #9ca3af;
`;

export default function ProductPage({product}) {
  const {addProduct} = useContext(CartContext);
  const [reviews,setReviews] = useState([]);
  const [rating,setRating] = useState(5);
  const [titleText,setTitleText] = useState('');
  const [content,setContent] = useState('');
  const [submitting,setSubmitting] = useState(false);
  useEffect(() => {
    fetch(`/api/reviews?product=${product._id}`).then(r=>r.json()).then(setReviews);
  }, [product._id]);
  
  const handleAddToCart = () => {
    addProduct(product._id);
    toast.success(`${product.title} е добавен в кошницата!`, {
      icon: '🛒',
      duration: 3000,
    });
  };
  async function submitReview(e){
    e.preventDefault();
    if (!titleText.trim() || !content.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({product:product._id,rating:Number(rating),title:titleText.trim(),content:content.trim()})});
      if (res.ok){
        setTitleText(''); setContent(''); setRating(5);
        const list = await fetch(`/api/reviews?product=${product._id}`).then(r=>r.json());
        setReviews(list);
      }
    } finally { setSubmitting(false); }
  }
  
  return (
    <>
      <Header />
      <Center>
        <ColWrapper>
          <WhiteBox>
            <ProductImages images={product.images} />
          </WhiteBox>
          <div>
            <Title>{product.title}</Title>
            <p>{product.description}</p>
            <PriceRow>
              <div>
                <Price>${product.price}</Price>
              </div>
              <div>
                <Button primary onClick={handleAddToCart}>
                  <CartIcon />Добави в кошница
                </Button>
              </div>
            </PriceRow>
          </div>
        </ColWrapper>
        <ReviewsSection>
          <ReviewsTitle>Ревюта</ReviewsTitle>
          <ReviewsGrid>
            <Card>
              <h3 className="font-semibold mb-2">Добави ревю</h3>
              <form onSubmit={submitReview}>
                <Stars>
                  {[1,2,3,4,5].map(n => (
                    <StarBtn key={n} type="button" active={n <= rating} onClick={()=>setRating(n)} aria-label={`Рейтинг ${n}`}>
                      {n <= rating ? '★' : '☆'}
                    </StarBtn>
                  ))}
                </Stars>
                <InputEl type="text" placeholder="Заглавие" value={titleText} onChange={e=>setTitleText(e.target.value)} />
                <TextareaEl placeholder="Беше ли добро? Плюсове? Минуси?" value={content} onChange={e=>setContent(e.target.value)} />
                <Button primary disabled={submitting}>
                  {submitting ? 'Изпращане...' : 'Изпрати ревю'}
                </Button>
              </form>
            </Card>
            <Card>
              <h3 className="font-semibold mb-2">Всички ревюта</h3>
              {reviews.length === 0 && <div>Няма ревюта.</div>}
              {reviews.map(r => (
                <div key={r._id} style={{borderTop:'1px solid #eee', paddingTop:12, marginTop:12}}>
                  <div style={{color:'#16a34a'}}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
                  <div className="font-semibold">{r.title}</div>
                  <SmallMuted>{new Date(r.createdAt).toLocaleString()}</SmallMuted>
                  <div className="mt-1">{r.content}</div>
                </div>
              ))}
            </Card>
          </ReviewsGrid>
        </ReviewsSection>
      </Center>
    </>
  );
}

export async function getServerSideProps(context) {
  await mongooseConnect();
  const {id} = context.query;
  const product = await Product.findById(id);
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    }
  }
}