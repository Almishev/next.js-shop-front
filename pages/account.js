import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import {useState, useEffect} from "react";
import axios from "axios";
import {useWishlist} from "@/components/WishlistContext";
import ProductBox from "@/components/ProductBox";
import ProductsGrid from "@/components/ProductsGrid";
import Footer from "@/components/Footer";

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.2fr .8fr;
  }
  gap: 40px;
  margin-top: 40px;
`;

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
`;

const TabsWrapper = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const Tab = styled.button`
  background: none;
  border: none;
  padding: 10px 0;
  font-size: 1rem;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  color: ${props => props.active ? '#000' : '#666'};
  border-bottom-color: ${props => props.active ? '#000' : 'transparent'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  
  &:hover {
    color: #000;
  }
`;

const OrderItem = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const OrderDate = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const OrderStatus = styled.span`
  background-color: ${props => props.paid ? '#d4edda' : '#f8d7da'};
  color: ${props => props.paid ? '#155724' : '#721c24'};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
`;

const OrderDetails = styled.div`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 10px;
`;

const OrderTotal = styled.div`
  font-weight: bold;
  color: #000;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
`;

const Button = styled.button`
  background-color: #000;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-right: 10px;
  
  &:hover {
    background-color: #333;
  }
`;

const LogoutButton = styled(Button)`
  background-color: #dc3545;
  
  &:hover {
    background-color: #c82333;
  }
`;

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [country, setCountry] = useState('');
  const {wishlistProducts, loading: wishlistLoading} = useWishlist();
  

  useEffect(() => {
    // Зареждаме данните от localStorage или prompt за email
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      fetchOrders(savedEmail);
      fetchUserData(savedEmail);
    } else {
      const userEmail = prompt('Please enter your email to view orders:');
      if (userEmail) {
        setEmail(userEmail);
        localStorage.setItem('userEmail', userEmail);
        fetchOrders(userEmail);
        fetchUserData(userEmail);
      }
    }
  }, []);

  const fetchOrders = async (userEmail) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/orders?email=${userEmail}`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async (userEmail) => {
    try {
      const response = await axios.get(`/api/user?email=${userEmail}`);
      if (response.data) {
        setName(response.data.name || '');
        setCity(response.data.city || '');
        setPostalCode(response.data.postalCode || '');
        setStreetAddress(response.data.streetAddress || '');
        setCountry(response.data.country || '');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleSave = async () => {
    if (!email || !name || !city || !postalCode || !streetAddress || !country) {
      alert('Please fill in all fields');
      return;
    }

    setSaving(true);
    try {
      await axios.post('/api/user', {
        email,
        name,
        city,
        postalCode,
        streetAddress,
        country
      });
      alert('Account details saved successfully!');
    } catch (error) {
      console.error('Error saving user data:', error);
      alert('Error saving account details');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    setEmail('');
    setName('');
    setCity('');
    setPostalCode('');
    setStreetAddress('');
    setCountry('');
    setOrders([]);
    window.location.href = '/';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const calculateTotal = (lineItems) => {
    if (!lineItems) return 0;
    return lineItems.reduce((total, item) => {
      return total + (item.price_data?.unit_amount || 0);
    }, 0) / 100; // Convert from cents to dollars
  };

  return (
    <>
      <Header />
      <Center>
        <ColumnsWrapper>
          <Box>
            <TabsWrapper>
              <Tab 
                active={activeTab === 'orders'} 
                onClick={() => setActiveTab('orders')}
              >
                Orders
              </Tab>
              <Tab 
                active={activeTab === 'wishlist'} 
                onClick={() => setActiveTab('wishlist')}
              >
                Wishlist
              </Tab>
            </TabsWrapper>

            {activeTab === 'orders' && (
              <div>
                <h2>Your Orders</h2>
                {loading ? (
                  <div>Loading orders...</div>
                ) : orders.length === 0 ? (
                  <div>No orders found.</div>
                ) : (
                  orders.map(order => (
                    <OrderItem key={order._id}>
                      <OrderHeader>
                        <OrderDate>{formatDate(order.createdAt)}</OrderDate>
                        <OrderStatus paid={order.paid}>
                          {order.paid ? 'Paid' : 'Pending'}
                        </OrderStatus>
                      </OrderHeader>
                      <OrderDetails>
                        <div><strong>Name:</strong> {order.name}</div>
                        <div><strong>Email:</strong> {order.email}</div>
                        <div><strong>Address:</strong> {order.streetAddress}, {order.city} {order.postalCode}, {order.country}</div>
                      </OrderDetails>
                      <OrderTotal>
                        Total: ${calculateTotal(order.line_items).toFixed(2)}
                      </OrderTotal>
                    </OrderItem>
                  ))
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div>
                <h2>Your Wishlist</h2>
                {wishlistLoading ? (
                  <div>Loading wishlist...</div>
                ) : wishlistProducts.length === 0 ? (
                  <div>No items in your wishlist yet.</div>
                ) : (
                  <ProductsGrid products={wishlistProducts} />
                )}
              </div>
            )}
          </Box>

          <Box>
            <h2>Account details</h2>
            <Input
              type="text"
              placeholder="Name"
              value={name}
              onChange={ev => setName(ev.target.value)}
            />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={ev => setEmail(ev.target.value)}
            />
            <Input
              type="text"
              placeholder="City"
              value={city}
              onChange={ev => setCity(ev.target.value)}
            />
            <Input
              type="text"
              placeholder="Postal Code"
              value={postalCode}
              onChange={ev => setPostalCode(ev.target.value)}
            />
            <Input
              type="text"
              placeholder="Street Address"
              value={streetAddress}
              onChange={ev => setStreetAddress(ev.target.value)}
            />
            <Input
              type="text"
              placeholder="Country"
              value={country}
              onChange={ev => setCountry(ev.target.value)}
            />
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
          </Box>
        </ColumnsWrapper>
      </Center>
      <Footer />
    </>
  );
}
