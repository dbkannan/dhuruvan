import { useState, useEffect } from "react";
import {
  Layout,
  Pagination,
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
} from "antd";
import {
  CheckCircleOutlined,
  TruckOutlined,
  UndoOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

function Products() {
  const [products, setProducts] = useState([]);
  const { page = 1 } = useParams();
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageLoading, setImageLoading] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `http://localhost:5004/?page=${page}&limit=10`
        );

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        setProducts(data.products);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page]);

  const handlePageChange = (newPage) => {
    window.location.href = `/page/${newPage}`;
    window.scrollTo(0, 0);
  };

  const handleImageLoad = (productId) => {
    setImageLoading((prev) => ({
      ...prev,
      [productId]: false, // Mark image as loaded
    }));
  };

  const handleImageError = (productId) => {
    setImageLoading((prev) => ({
      ...prev,
      [productId]: false, // Handle image error and stop showing skeleton
    }));
  };

  const renderProductDetails = (product) => (
    <Card
      hoverable
      style={{
        borderRadius: 8,
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
        height: "100%",
      }}
      cover={
        <div style={{ position: "relative", background: "#f8f9fa" }}>
          <Image
            src={product.thumbnail}
            alt={product.title}
            style={{
              padding: 16,
              objectFit: "contain",
              width: "100%",
              height: 300,
            }}
            placeholder={
              <Skeleton.Image active style={{ width: "500px", height: 300 }} />
            }
            onLoad={() => handleImageLoad(product._id)}
            onError={() => handleImageError(product._id)}
          />
          <div
            style={{
              display: "flex",
              gap: 8,
              padding: 8,
              background: "#fff",
              borderTop: "1px solid #f0f0f0",
            }}
          >
            {product.images.map((img, index) => (
              <Image
                key={index}
                src={img}
                alt={`Product image ${index + 1}`}
                style={{
                  width: 60,
                  height: 60,
                  border: "1px solid #f0f0f0",
                  borderRadius: 4,
                  cursor: "pointer",
                  transition: "border-color 0.3s",
                }}
                placeholder={
                  <Skeleton.Image
                    active
                    style={{ width: "100%", height: 60 }}
                  />
                }
                onLoad={() => handleImageLoad(product._id)}
                onError={() => handleImageError(product._id)}
              />
            ))}
          </div>
        </div>
      }
    >
      <div>
        <Skeleton
          active
          title={false}
          paragraph={{ rows: 1 }}
          loading={loading}
        >
          <Title level={4} ellipsis={{ rows: 2 }}>
            {product.title}
          </Title>
        </Skeleton>

        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <Skeleton active paragraph={{ rows: 1 }} loading={loading}>
            <Space size="small" style={{ alignItems: "center" }}>
              <Text strong style={{ fontSize: 18 }}>
                $
                {(
                  product.price -
                  (product.price * product.discountPercentage) / 100
                ).toFixed(2)}
              </Text>
              {product.discountPercentage > 0 && (
                <>
                  <Text delete style={{ fontSize: 14, color: "#8c8c8c" }}>
                    ${product.price}
                  </Text>
                  <Tag color="red">{product.discountPercentage}% OFF</Tag>
                </>
              )}
            </Space>
          </Skeleton>

          <Skeleton active paragraph={{ rows: 1 }} loading={loading}>
            <Space size="small" style={{ alignItems: "center" }}>
              <Rate
                disabled
                allowHalf
                defaultValue={product.rating}
                style={{ fontSize: 16 }}
              />
              <Tag
                color={
                  product.availabilityStatus === "In Stock" ? "green" : "red"
                }
                icon={<CheckCircleOutlined />}
              >
                {product.stock} in stock
              </Tag>
            </Space>
          </Skeleton>
        </Space>
      </div>

      <Divider dashed />

      <Tabs defaultActiveKey="1">
        <TabPane tab="Description" key="1">
          <Skeleton active paragraph={{ rows: 2 }} loading={loading}>
            <Text type="secondary">{product.description}</Text>
          </Skeleton>
          <div style={{ marginTop: 16 }}>
            <Title level={5}>Specifications</Title>
            <Row gutter={16}>
              <Col span={12}>
                <Skeleton active paragraph={{ rows: 1 }} loading={loading}>
                  <Text strong>Brand:</Text> {product.brand}
                </Skeleton>
              </Col>
              <Col span={12}>
                <Skeleton active paragraph={{ rows: 1 }} loading={loading}>
                  <Text strong>SKU:</Text> {product.sku}
                </Skeleton>
              </Col>
              <Col span={12}>
                <Skeleton active paragraph={{ rows: 1 }} loading={loading}>
                  <Text strong>Weight:</Text> {product.weight} kg
                </Skeleton>
              </Col>
              <Col span={12}>
                <Skeleton active paragraph={{ rows: 1 }} loading={loading}>
                  <Text strong>Dimensions:</Text> {product.dimensions.width}x
                  {product.dimensions.height}x{product.dimensions.depth} cm
                </Skeleton>
              </Col>
            </Row>
          </div>
        </TabPane>

        <TabPane tab="Shipping & Returns" key="2">
          <List
            itemLayout="horizontal"
            dataSource={[
              { icon: <TruckOutlined />, text: product.shippingInformation },
              { icon: <UndoOutlined />, text: product.returnPolicy },
              {
                icon: <SafetyCertificateOutlined />,
                text: product.warrantyInformation,
              },
            ]}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta avatar={item.icon} description={item.text} />
              </List.Item>
            )}
          />
        </TabPane>
      </Tabs>

      <Divider dashed />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 16,
        }}
      >
        <Space wrap size={4}>
          {product.tags.map((tag) => (
            <Tag key={tag} color="blue">
              {tag}
            </Tag>
          ))}
        </Space>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Item ID: {product.sku}
        </Text>
      </div>
    </Card>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ background: "#fff", padding: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Title level={2} style={{ margin: 0 }}>
            <span role="img" aria-label="shop">
              🛍️
            </span>{" "}
            Baskaran And Co
          </Title>
        </div>
      </Header>

      <Content style={{ padding: "0 50px", marginTop: 24 }}>
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        <Row gutter={[24, 24]}>
          {loading
            ? Array.from({ length: 10 }).map((_, index) => (
                <Col key={index} xs={24} sm={12} md={12} lg={8}>
                  <Skeleton active avatar paragraph={{ rows: 4 }} />
                </Col>
              ))
            : products.map((product) => (
                <Col key={product._id} xs={24} sm={12} md={12} lg={8}>
                  <Link to={`products/${product._id}`}>
                    {renderProductDetails(product)}
                  </Link>
                </Col>
              ))}
        </Row>

        <div
          style={{
            textAlign: "center",
            marginTop: 24,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Pagination
            current={page}
            total={totalPages}
            pageSize={10}
            onChange={handlePageChange}
            showSizeChanger={false}
            disabled={loading}
          />
        </div>
      </Content>

      <Footer style={{ textAlign: "center" }}>
        <Text type="secondary">
          © {new Date().getFullYear()} Baskaran And Co. All rights reserved.
        </Text>
      </Footer>
    </Layout>
  );
}

export default Products;
