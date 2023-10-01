import { query } from "express";
import Product from "../models/Product";
import { ProductCreateI, ProductI } from "../types/product";
import chazaService from "./chaza.service";

const productService = {
  get: async function (_id: String): Promise<ProductI> {
    //Consultar en la colección de productos de la base de datos
    const productDB = await Product.findOne({ _id: _id }).exec();
    if (!productDB) throw new Error("Product not found");
    //Convertir el resultado a un objeto de tipo ProductI
    let product: ProductI = {
      _id: productDB._id,
      name: productDB.name,
      description: productDB.description,
      category: productDB.category,
      price: productDB.price,
      stock: productDB.stock,
      image: productDB.image,
      total_sales: productDB.total_sales,
    };
    //Retornar el producto
    return product;
  },
  getAll: async function (): Promise<ProductI[]> {
    //Consultar la colección de productos de la base de datos
    const productListDB = await Product.find().exec();
    //Convertir el resultado a un arreglo de objetos de tipo ProductI
    let products = productListDB.map((product) => ({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      stock: product.stock,
      image: product.image,
      total_sales: product.total_sales,
    }));
    //Retornar el arreglo de productos
    return products;
  },
  create: async function (product: ProductCreateI): Promise<ProductCreateI> {
    //Crear un nuevo producto que va a ser guardado en la base de datos
    let newProduct = new Product({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      stock: product.stock,
      image: product.image,
      total_sales: product.total_sales,
    });
    if (!newProduct) throw new Error("Error creating product");
    //Guardar el producto en la base de datos
    let result = await newProduct.save();
    if (!result) throw new Error("Error saving product");
    //Convertir el resultado a un objeto de tipo ProductI

    //Añadir el producto a la chaza
    await chazaService.addProduct(
      product.chaza_id.toString(),
      result._id.toString()
    );

    let data: ProductCreateI = {
      chaza_id: product.chaza_id,
      name: result.name,
      description: result.description,
      category: result.category,
      price: result.price,
      stock: result.stock,
      image: result.image,
      total_sales: result.total_sales,
    };
    //Retornar el objeto creado
    return data;
  },
  update: async function (newProduct: ProductI): Promise<ProductI> {
    //Actualizar el producto en la base de datos
    const productDB = await Product.findOneAndUpdate(
      { name: newProduct.name },
      newProduct
    ).exec();
    if (!productDB) throw new Error("Error updating product");
    //Convertir el resultado a un objeto de tipo ProductI
    let updateProduct: ProductI = {
      _id: productDB._id,
      name: productDB.name,
      description: productDB.description,
      category: productDB.category,
      price: productDB.price,
      stock: productDB.stock,
      image: productDB.image,
      total_sales: productDB.total_sales,
    };
    //Retornar el objeto actualizado
    return updateProduct;
  },
  delete: async function (chaza_id: String, _id: String): Promise<ProductI> {
    //Eliminar el producto de la base de datos
    const productDB = await Product.findOneAndDelete({ _id: _id }).exec();
    if (!productDB) throw new Error("Error deleting product");
    //Convertir el resultado a un objeto de tipo ProductI
    let deleteProduct: ProductI = {
      _id: productDB._id,
      name: productDB.name,
      description: productDB.description,
      category: productDB.category,
      price: productDB.price,
      stock: productDB.stock,
      image: productDB.image,
      total_sales: productDB.total_sales,
    };
    //Eliminar el producto de la chaza
    await chazaService.deleteProduct(chaza_id, productDB._id.toString());
    //Retornar el objeto eliminado
    return deleteProduct;
  },
  getByFilters: async function (
    priceOrder: Number,
    priceRange: Number[],
    category: Number[]
  ): Promise<ProductI[]> {
    const query = {
      price: { $gte: priceRange[0], $lte: priceRange[1] },
      category: { $in: category },
    };
    const productListDB = await Product.find(query)
      .sort({ price: priceOrder===1?"ascending":"descending"})
      .exec();
    //Convertir el resultado a un arreglo de objetos de tipo ProductI
    let productsFiltered = productListDB.map((product) => ({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      stock: product.stock,
      image: product.image,
      total_sales: product.total_sales,
    }));
    //Retornar el arreglo de productos
    return productsFiltered;
  },
};

export default productService;
