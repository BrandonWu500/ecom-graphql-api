const User = require("../models/User");
const Order = require("../models/Order");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLFloat,
} = require("graphql");
const Product = require("../models/Product");

// Order Type
const OrderType = new GraphQLObjectType({
  name: "Order",
  fields: () => ({
    id: { type: GraphQLID },
    status: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.userId);
      },
    },
    products: {
      type: new GraphQLList(ProductType),
      resolve(parent, args) {
        return parent.productIds.map((productId) =>
          Product.findById(productId)
        );
      },
    },
  }),
});

// Product Type
const ProductType = new GraphQLObjectType({
  name: "Product",
  fields: () => ({
    id: { type: GraphQLID },
    name: {
      type: GraphQLString,
    },
    price: {
      type: GraphQLFloat,
    },
  }),
});

// User Type
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    password: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    orders: {
      type: new GraphQLList(OrderType),
      resolve(parent, args) {
        return Order.find();
      },
    },
    order: {
      type: OrderType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Order.findById(args.id);
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return User.find();
      },
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return User.findById(args.id);
      },
    },
    products: {
      type: new GraphQLList(ProductType),
      resolve(parent, args) {
        return Product.find();
      },
    },
    product: {
      type: ProductType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Product.findById(args.id);
      },
    },
  },
});

// Mutations
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    // Add a user
    addUser: {
      type: UserType,
      args: {
        username: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        const user = new User({
          username: args.username,
          password: args.password,
        });

        return user.save();
      },
    },
    // Delete a user
    deleteUser: {
      type: UserType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        Order.find({ userId: args.id }).then((orders) => {
          orders.forEach((order) => {
            order.deleteOne();
          });
        });

        return User.findByIdAndRemove(args.id);
      },
    },

    // Add a product
    addProduct: {
      type: ProductType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        price: { type: GraphQLNonNull(GraphQLFloat) },
      },
      resolve(parent, args) {
        const product = new Product({
          name: args.name,
          price: args.price,
        });

        return product.save();
      },
    },
    // Delete a product
    deleteProduct: {
      type: ProductType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Product.findByIdAndRemove(args.id);
      },
    },
    // Add a order
    addOrder: {
      type: OrderType,
      args: {
        status: {
          type: new GraphQLEnumType({
            name: "OrderStatus",
            values: {
              Processing: { value: "Processing" },
              Shipped: { value: "Shipped" },
              Delivered: { value: "Delivered" },
            },
          }),
          defaultValue: "Processing",
        },
        userId: { type: GraphQLNonNull(GraphQLID) },
        productIds: { type: new GraphQLList(GraphQLID) },
      },
      resolve(parent, args) {
        const order = new Order({
          status: args.status,
          userId: args.userId,
          productIds: args.productIds,
        });

        return order.save();
      },
    },
    // Delete a order
    deleteOrder: {
      type: OrderType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Order.findByIdAndRemove(args.id);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
