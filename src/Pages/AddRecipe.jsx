import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header'; 
import Footer from '../components/Footer';
import { 
  Layout, 
  Typography, 
  Form, 
  Input, 
  Button, 
  Card, 
  Upload, 
  Select, 
  Space,
  message
} from 'antd';
import { CameraOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

import { db } from '../utils/firebase';

import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const AddRecipe = () => {
  const [form] = Form.useForm();
  const [tags, setTags] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://dummyjson.com/recipes/tags')
      .then(res => res.json())
      .then(data => setTags(data))
      .catch(error => console.error('Error fetching tags:', error));
  }, []);

  const handleImageUpload = ({ file }) => {
    setImageFile(file);
    return false;
  };

  const onFinish = async (values) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      message.error('You must be logged in to add a recipe');
      return;
    }

    try {
      let imageUrl = null;
      if (imageFile) {
        const storage = getStorage();
        const storageRef = ref(storage, `recipe-images/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      // Create a clean copy of the form values without the File object
      const recipeData = {
        ...values,
        imageUrl,
        userId: user.uid,
        createdAt: new Date()
      };

      // Remove the image field since we're using imageUrl instead
      delete recipeData.image;

      const db = getFirestore();
      await addDoc(collection(db, 'recipes'), recipeData);

      message.success('Recipe added successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Error adding recipe:', error);
      message.error('Failed to add recipe');
    }
  };

  return (
    <Layout className="min-h-screen bg-white">
      <Header />
      <Content className="p-8">
        <div className="container mx-auto max-w-4xl">
          <Title level={2}>Create new recipe</Title>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item name="title" label="Recipe Title:" rules={[{ required: true, message: 'Please input the recipe title!' }]}>
              <Input placeholder="Black Bean & Corn Quesadillas" />
            </Form.Item>

            <Form.Item name="image" label="Recipe image:">
              <Upload
                listType="picture-card"
                showUploadList={false}
                customRequest={handleImageUpload}
                beforeUpload={(file) => {
                  const isImage = file.type.startsWith('image/');
                  if (!isImage) {
                    message.error('You can only upload image files!');
                  }
                  return isImage;
                }}
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>

            <Form.Item name="description" label="Description:" rules={[{ required: true, message: 'Please input the recipe description!' }]}>
              <TextArea rows={4} placeholder="Introduce your recipe" />
            </Form.Item>

            <Form.List name="ingredients" rules={[{ required: true, message: 'Please add at least one ingredient!' }]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Form.Item
                      {...field}
                      label={index === 0 ? 'Ingredients:' : ''}
                      required={false}
                      key={field.key}
                    >
                      <Space>
                        <Input placeholder={`Ingredient ${index + 1}`} />
                        {fields.length > 1 && (
                          <MinusCircleOutlined onClick={() => remove(field.name)} />
                        )}
                      </Space>
                    </Form.Item>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Add ingredient
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Form.List name="instructions" rules={[{ required: true, message: 'Please add at least one instruction!' }]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Form.Item
                      {...field}
                      label={index === 0 ? 'Instructions:' : ''}
                      required={false}
                      key={field.key}
                    >
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Text strong>Step {index + 1}</Text>
                        <Space>
                          <TextArea rows={3} placeholder={`Instruction ${index + 1}`} style={{ width: 'calc(100% - 32px)' }} />
                          {fields.length > 1 && (
                            <MinusCircleOutlined onClick={() => remove(field.name)} />
                          )}
                        </Space>
                      </Space>
                    </Form.Item>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Add instruction
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Space size="large" style={{ display: 'flex', marginBottom: 16 }}>
              <Form.Item name="servings" label="Servings:" rules={[{ required: true, message: 'Please input the number of servings!' }]}>
                <Input placeholder="How many servings?" />
              </Form.Item>
              <Form.Item label="Cooking Time:">
                <Input.Group compact>
                  <Form.Item name={['cookingTime', 'hours']} noStyle>
                    <Input style={{ width: 100 }} placeholder="Hours" />
                  </Form.Item>
                  <Form.Item name={['cookingTime', 'minutes']} noStyle>
                    <Input style={{ width: 100 }} placeholder="Minutes" />
                  </Form.Item>
                </Input.Group>
              </Form.Item>
            </Space>

            <Space size="large" style={{ display: 'flex', marginBottom: 16 }}>
              <Form.Item label="Prep Time:">
                <Input.Group compact>
                  <Form.Item name={['prepTime', 'hours']} noStyle>
                    <Input style={{ width: 100 }} placeholder="Hours" />
                  </Form.Item>
                  <Form.Item name={['prepTime', 'minutes']} noStyle>
                    <Input style={{ width: 100 }} placeholder="Minutes" />
                  </Form.Item>
                </Input.Group>
              </Form.Item>
              <Form.Item name="cuisine" label="Cuisine:">
                <Select style={{ width: 200 }}>
                  <Option value="italian">Italian</Option>
                  <Option value="american">American</Option>
                  <Option value="indian">Indian</Option>
                  <Option value="pakistani">Pakistani</Option>
                  <Option value="turkish">Turkish</Option>
                  <Option value="japanese">Japanese</Option>
                  <Option value="chinese">Chinese</Option>
                  <Option value="korean">Korean</Option>
                </Select>
              </Form.Item>
            </Space>

            <Form.Item name="tags" label="Tags:">
              <Select mode="multiple" style={{ width: '100%' }} placeholder="Select tags">
                {tags.map(tag => (
                  <Option key={tag} value={tag}>{tag}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="collection" label="Collection:">
              <Select style={{ width: 200 }}>
                <Option value="collection1">1 Collection selected</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ backgroundColor: '#B55D51', borderColor: '#B55D51' }}>
                Save Recipe
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
      <Footer />
    </Layout>
  );
};

export default AddRecipe;