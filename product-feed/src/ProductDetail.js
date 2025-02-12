import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Layout,
  Row,
  Col,
  Card,
  Skeleton,
  Typography,
  Alert,
  Tag,
  Rate,
  Tabs,
  List,
  Divider,
  Space,
  Image,
  Button,
} from "antd";
import {
  CheckCircleOutlined,
  TruckOutlined,
  UndoOutlined,
  SafetyCertificateOutlined,
  ArrowLeftOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mainImageLoading, setMainImageLoading] = useState(true);
  const [cart, setCart] = useState([]); // Cart state

  useEffect(() => {
    const fetchProduct = async () => {
      setError("");
      try {
        const response = await fetch(`http://localhost:5004/product/${id}`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setProduct(...data.product); // Assuming the product is an array
      } catch (err) {
        setError("Failed to fetch product details. Please try again later.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    setCart([...cart, product]); // Add the product to the cart
    const { title, price, images } = product;
    const image = images[0];
    const result = await axios.post("http://localhost:5008/addcart", {
      userId: "6798d6506f5c44e9ffe75d99",
      items: { title, price, image, quantity: 1 },
    });
    alert(`${product.title} has been added to the cart!`);
  };

  if (error) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Content style={{ padding: "50px 50px" }}>
          <Alert message="Error" description={error} type="error" showIcon />
          <Button type="primary" style={{ marginTop: 24 }}>
            <Link to="/">Back to Home</Link>
          </Button>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "50px 50px" }}>
        <Button icon={<ArrowLeftOutlined />} style={{ marginBottom: 24 }}>
          <Link to="/">Back to Products</Link>
        </Button>

        {loading ? (
          <Skeleton active paragraph={{ rows: 10 }} />
        ) : product ? (
          <Card
            style={{
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <Image.PreviewGroup>
                  <div style={{ position: "relative", marginBottom: 16 }}>
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      style={{
                        width: "100%",
                        height: 400,
                        objectFit: "contain",
                        display: mainImageLoading ? "none" : "block",
                      }}
                      onLoad={() => setMainImageLoading(false)}
                      onError={() => setMainImageLoading(false)}
                    />
                  </div>
                  <Space wrap>
                    {product.images.map((img, index) => (
                      <Image
                        key={index}
                        src={img}
                        width={100}
                        height={100}
                        style={{
                          objectFit: "cover",
                          cursor: "pointer",
                          border: "2px solid #f0f0f0",
                          borderRadius: 4,
                        }}
                        placeholder={
                          <Skeleton.Image
                            active
                            style={{ width: 100, height: 100 }}
                          />
                        }
                      />
                    ))}
                  </Space>
                </Image.PreviewGroup>
              </Col>

              <Col xs={24} md={12}>
                <Title level={2}>{product.title}</Title>

                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  <Space size="small" style={{ alignItems: "center" }}>
                    <Text strong style={{ fontSize: 24 }}>
                      $
                      {(
                        product.price -
                        (product.price * product.discountPercentage) / 100
                      ).toFixed(2)}
                    </Text>
                    {product.discountPercentage > 0 && (
                      <>
                        <Text delete style={{ fontSize: 18, color: "#8c8c8c" }}>
                          ${product.price}
                        </Text>
                        <Tag color="red" style={{ fontSize: 16 }}>
                          {product.discountPercentage}% OFF
                        </Tag>
                      </>
                    )}
                  </Space>

                  <Space size="small" style={{ alignItems: "center" }}>
                    <Rate
                      disabled
                      allowHalf
                      defaultValue={product.rating}
                      style={{ fontSize: 18 }}
                    />
                    <Tag
                      color={
                        product.availabilityStatus === "In Stock"
                          ? "green"
                          : "red"
                      }
                      icon={<CheckCircleOutlined />}
                      style={{ fontSize: 14 }}
                    >
                      {product.stock} in stock
                    </Tag>
                  </Space>

                  <Divider dashed />

                  <Tabs defaultActiveKey="1">
                    <TabPane tab="Description" key="1">
                      <Text type="secondary">{product.description}</Text>
                      <div style={{ marginTop: 16 }}>
                        <Title level={5}>Specifications</Title>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Text strong>Brand:</Text> {product.brand}
                          </Col>
                          <Col span={12}>
                            <Text strong>SKU:</Text> {product.sku}
                          </Col>
                          <Col span={12}>
                            <Text strong>Weight:</Text> {product.weight} kg
                          </Col>
                          <Col span={12}>
                            <Text strong>Dimensions:</Text>{" "}
                            {product.dimensions.width}x
                            {product.dimensions.height}x
                            {product.dimensions.depth} cm
                          </Col>
                        </Row>
                      </div>
                    </TabPane>

                    <TabPane tab="Shipping & Returns" key="2">
                      <List
                        itemLayout="horizontal"
                        dataSource={[
                          {
                            icon: <TruckOutlined />,
                            text: product.shippingInformation,
                          },
                          {
                            icon: <UndoOutlined />,
                            text: product.returnPolicy,
                          },
                          {
                            icon: <SafetyCertificateOutlined />,
                            text: product.warrantyInformation,
                          },
                        ]}
                        renderItem={(item) => (
                          <List.Item>
                            <List.Item.Meta
                              avatar={item.icon}
                              description={item.text}
                            />
                          </List.Item>
                        )}
                      />
                    </TabPane>
                  </Tabs>

                  <Divider dashed />

                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Space wrap size={4}>
                      {product.tags.map((tag) => (
                        <Tag key={tag} color="blue" style={{ fontSize: 14 }}>
                          {tag}
                        </Tag>
                      ))}
                    </Space>
                    <Text type="secondary" style={{ fontSize: 14 }}>
                      Item ID: {product.sku}
                    </Text>
                  </div>

                  <Button
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    onClick={handleAddToCart}
                    style={{ marginTop: 16 }}
                  >
                    Add to Cart
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>
        ) : (
          <Alert
            message="Product not found"
            description="The requested product does not exist."
            type="warning"
            showIcon
          />
        )}
      </Content>
    </Layout>
  );
}

export default ProductDetail;
