import styled from "styled-components";
import Center from "@/components/Center";
import Link from "next/link";

const StyledFooter = styled.footer`
  background-color: #222;
  color: #aaa;
  padding: 40px 0;
  margin-top: 60px;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  
  @media screen and (min-width: 768px) {
    grid-template-columns: 2fr 1fr 1fr 1fr;
  }
`;

const FooterSection = styled.div`
  h3 {
    color: #fff;
    margin-bottom: 15px;
    font-size: 1.1rem;
    font-weight: 600;
  }
  
  p {
    line-height: 1.6;
    margin-bottom: 10px;
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  li {
    margin-bottom: 8px;
  }
  
  a {
    color: #aaa;
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: #fff;
    }
  }
`;

const Logo = styled.div`
  h2 {
    color: #fff;
    margin: 0 0 15px 0;
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  p {
    font-size: 0.9rem;
    line-height: 1.6;
    margin-bottom: 20px;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
  
  a {
    display: inline-block;
    width: 40px;
    height: 40px;
    background-color: #333;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease;
    
    &:hover {
      background-color: #555;
    }
  }
`;

const ContactInfo = styled.div`
  .contact-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    
    svg {
      margin-right: 10px;
      width: 16px;
      height: 16px;
    }
  }
`;

const BottomBar = styled.div`
  border-top: 1px solid #333;
  margin-top: 40px;
  padding-top: 20px;
  text-align: center;
  font-size: 0.9rem;
  
  @media screen and (min-width: 768px) {
    text-align: left;
  }
`;

const PaymentMethods = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
  justify-content: center;
  
  @media screen and (min-width: 768px) {
    justify-content: flex-start;
  }
  
  .payment-icon {
    width: 30px;
    height: 20px;
    background-color: #333;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: bold;
  }
`;

export default function Footer() {
  return (
    <StyledFooter>
      <Center>
        <FooterContent>
          <FooterSection>
            <Logo>
              <h2>Natrufenka Jewelry</h2>
              <p>
                Специализирани в ръчно изработени гердани, гривни и комплекти от лава, 
                маниста и перли. Уникални бижута за дами и мъже, идеални за всеки повод.
                Всички наши продукти са направени с любов и внимание към детайла.
              </p>
              <SocialLinks>
                <a href="#" title="Facebook">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" title="Instagram">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781H7.721v8.48h8.558V7.207z"/>
                  </svg>
                </a>
                <a href="#" title="Pinterest">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM12.017 2.16c5.4 0 9.828 4.428 9.828 9.828s-4.428 9.828-9.828 9.828-9.828-4.428-9.828-9.828S6.617 2.16 12.017 2.16zm0 1.65c-4.515 0-8.178 3.663-8.178 8.178s3.663 8.178 8.178 8.178 8.178-3.663 8.178-8.178-3.663-8.178-8.178-8.178zm0 1.35c3.75 0 6.828 3.078 6.828 6.828s-3.078 6.828-6.828 6.828-6.828-3.078-6.828-6.828 3.078-6.828 6.828-6.828z"/>
                  </svg>
                </a>
              </SocialLinks>
            </Logo>
          </FooterSection>

          <FooterSection>
            <h3>Категории</h3>
            <ul>
              <li><Link href="/products">Всички продукти</Link></li>
              <li><Link href="/products?category=gerdani">Гердани от перли</Link></li>
              <li><Link href="/products?category=griuni">Гривни от лава</Link></li>
              <li><Link href="/products?category=komplekti">Комплекти</Link></li>
              <li><Link href="/products?category=mashki">Мъжки бижута</Link></li>
              <li><Link href="/products?category=damski">Дамски бижута</Link></li>
              <li><Link href="/products?category=manista">Бижута с маниста</Link></li>
            </ul>
          </FooterSection>

          <FooterSection>
            <h3>Информация</h3>
            <ul>
              <li><Link href="/about">За нас</Link></li>
              <li><Link href="/care">Грижа за бижутата</Link></li>
              <li><Link href="/gift-cards">Подаръчни карти</Link></li>
              <li><Link href="/custom-orders">Поръчки по избор</Link></li>
              <li><Link href="/privacy-policy">Политика на поверителност</Link></li>
              <li><Link href="/terms">Общи условия</Link></li>
            </ul>
          </FooterSection>

          <FooterSection>
            <h3>Контакти</h3>
            <ContactInfo>
              <div className="contact-item">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span>София, България</span>
              </div>
              <div className="contact-item">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                <span>+359 888 123 456</span>
              </div>
              <div className="contact-item">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <span>info@artisan-jewelry.bg</span>
              </div>
            </ContactInfo>
          </FooterSection>
        </FooterContent>

        <BottomBar>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px'}}>
            <div>
              © {new Date().getFullYear()} Natrufenka Jewelry. Всички права запазени.
            </div>
            <PaymentMethods>
              <div className="payment-icon">VISA</div>
              <div className="payment-icon">MC</div>
              <div className="payment-icon">PP</div>
              <div className="payment-icon">STRIPE</div>
            </PaymentMethods>
          </div>
        </BottomBar>
      </Center>
    </StyledFooter>
  );
}
