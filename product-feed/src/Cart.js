import { Link } from "react-router-dom";
import {
  Layout,
  Row,
  Col,
  List,
  Card,
  Button,
  InputNumber,
  Typography,
  Divider,
  Space,
  Tag,
  Image,
  Alert,
} from "antd";
import {
  ShoppingCartOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import axios from "axios";
const { Header, Content } = Layout;
const { Title, Text } = Typography;

function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const result = await axios.get(
          "http://localhost:5008/getcart/6798d6506f5c44e9ffe75d99"
        );
        // Assuming result.data.userCart is an array
        setCartItems([...cartItems, result.data.userCart]); // Avoid nesting by directly setting the result
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);
  // Correct subtotal calculation
  const subtotal =
    (cartItems &&
      cartItems
        .map((data) =>
          data.items
            ? data.items.reduce(
                (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
                0
              )
            : 0
        )
        .reduce((total, itemSubtotal) => total + itemSubtotal, 0)) ||
    0;

  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const handleQuantityChange = async (id, value) => {
    // Update quantity logic here
    const result = await axios.post("http://localhost:5008/updatecart", {
      userId: "6798d6506f5c44e9ffe75d99",
      items: { quantity: value },
    });
    console.log(result);
  };

  const handleRemoveItem = (id) => {
    // Remove item logic here
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ background: "#fff", padding: "0 50px" }}>
        <Row justify="space-between" align="middle">
          <Title level={3} style={{ margin: 0 }}>
            <ShoppingCartOutlined /> Shopping Cart
          </Title>
          <Text strong>{cartItems.length} ITEMS</Text>
        </Row>
      </Header>

      <Content style={{ padding: "50px 50px" }}>
        {cartItems.length === 0 ? (
          <Alert
            message="Your cart is empty"
            description={
              <Link to="/">
                <Button type="primary">Continue Shopping</Button>
              </Link>
            }
            type="info"
            showIcon
          />
        ) : (
          <Row gutter={[32, 32]}>
            <Col xs={24} lg={16}>
              <List
                itemLayout="vertical"
                dataSource={cartItems}
                renderItem={(cartItem) => (
                  <div key={cartItem._id}>
                    <Title level={4}>{`Cart ID: ${cartItem._id}`}</Title>
                    <List
                      itemLayout="vertical"
                      dataSource={cartItem.items || []}
                      renderItem={(item) => (
                        <List.Item key={item._id}>
                          <List.Item.Meta
                            avatar={
                              <Image
                                src={item.image}
                                alt={item.title}
                                width={120}
                                height={120}
                                style={{ objectFit: "contain" }}
                              />
                            }
                            title={
                              <Link to={`/product/${item._id}`}>
                                {item.title}
                              </Link>
                            }
                            description={
                              <Space direction="vertical">
                                <Text
                                  type={
                                    item.quantity > 0 ? "secondary" : "danger"
                                  }
                                >
                                  {item.quantity > 0
                                    ? "In Stock"
                                    : "Out of Stock"}
                                </Text>
                              </Space>
                            }
                          />
                          <div style={{ textAlign: "right" }}>
                            <Text strong style={{ fontSize: 18 }}>
                              ${(item.price * item.quantity).toFixed(2)}
                            </Text>
                            <div style={{ marginTop: 8 }}>
                              <InputNumber
                                min={1}
                                max={10}
                                defaultValue={item.quantity}
                                onChange={(value) =>
                                  handleQuantityChange(item._id, value)
                                }
                                style={{ width: 100 }}
                              />
                              <Text type="secondary" style={{ marginLeft: 8 }}>
                                ${item.price.toFixed(2) || 0} each
                              </Text>
                            </div>
                          </div>
                        </List.Item>
                      )}
                    />
                  </div>
                )}
              />
            </Col>

            <Col xs={24} lg={8}>
              <Card
                title="Order Summary"
                headStyle={{ fontSize: 18, fontWeight: "bold" }}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Row justify="space-between">
                    <Text>Subtotal:</Text>
                    <Text strong>${subtotal.toFixed(2) || 0}</Text>
                  </Row>
                  <Row justify="space-between">
                    <Text>Shipping:</Text>
                    <Text strong>
                      {shipping === 0 ? (
                        <Tag color="green">FREE</Tag>
                      ) : (
                        `$${shipping.toFixed(2) || 0}`
                      )}
                    </Text>
                  </Row>
                  <Row justify="space-between">
                    <Text>Tax (10%):</Text>
                    <Text strong>${tax.toFixed(2) || 0}</Text>
                  </Row>
                  <Divider />
                  <Row justify="space-between">
                    <Title level={4}>Total:</Title>
                    <Title level={4}>${total.toFixed(2) || 0}</Title>
                  </Row>
                  <Divider />
                  <Button
                    type="primary"
                    size="large"
                    block
                    style={{ height: 50, fontSize: 16 }}
                  >
                    Proceed to Checkout
                  </Button>
                  <Link to="/">
                    <Button
                      block
                      icon={<ArrowLeftOutlined />}
                      style={{ marginTop: 16 }}
                    >
                      Continue Shopping
                    </Button>
                  </Link>
                </Space>
              </Card>
            </Col>
          </Row>
        )}
      </Content>
    </Layout>
  );
}

export default Cart;
