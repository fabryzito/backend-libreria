import mongoose from "mongoose"
import dotenv from "dotenv"
import User from "../models/User.js"
import Category from "../models/Category.js"
import Provider from "../models/Provider.js"
import Product from "../models/Product.js"
import Client from "../models/Client.js"

dotenv.config()

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("✅ Connected to MongoDB")

    // Clear existing data
    await User.deleteMany()
    await Category.deleteMany()
    await Provider.deleteMany()
    await Product.deleteMany()
    await Client.deleteMany()
    console.log("🗑️  Cleared existing data")

    // Create users
    const users = await User.create([
      {
        name: "Administrador",
        email: "admin@libreria.com",
        password: "admin123",
        role: "admin",
      },
      {
        name: "Juan Pérez",
        email: "empleado@libreria.com",
        password: "empleado123",
        role: "employee",
      },
      {
        name: "María García",
        email: "cliente@libreria.com",
        password: "cliente123",
        role: "client",
      },
    ])
    console.log("👥 Created users")

    // Create categories
    const categories = await Category.create([
      { name: "Novelas", description: "Libros de ficción y novelas" },
      { name: "Ciencia", description: "Libros científicos y técnicos" },
      { name: "Historia", description: "Libros de historia" },
      { name: "Infantil", description: "Libros para niños" },
      { name: "Autoayuda", description: "Libros de desarrollo personal" },
    ])
    console.log("📚 Created categories")

    // Create providers
    const providers = await Provider.create([
      {
        name: "Editorial Planeta",
        contact: "Carlos Ruiz",
        phone: "+34 912 345 678",
        email: "contacto@planeta.com",
        address: "Av. Diagonal 662-664, Barcelona",
      },
      {
        name: "Penguin Random House",
        contact: "Ana Martínez",
        phone: "+34 913 987 654",
        email: "info@penguinrandomhouse.com",
        address: "Travessera de Gràcia 47-49, Barcelona",
      },
      {
        name: "Anagrama",
        contact: "Jorge Herralde",
        phone: "+34 933 636 363",
        email: "anagrama@anagrama-ed.es",
        address: "Pedró de la Creu 58, Barcelona",
      },
    ])
    console.log("🏢 Created providers")

    // Create products
    const products = await Product.create([
      {
        name: "Cien años de soledad",
        brand: "Gabriel García Márquez",
        description: "Una obra maestra de la literatura latinoamericana",
        price: 19.99,
        stock: 25,
        category: categories[0]._id,
        provider: providers[0]._id,
        image: "/placeholder.svg?height=400&width=300",
      },
      {
        name: "Sapiens",
        brand: "Yuval Noah Harari",
        description: "De animales a dioses: Breve historia de la humanidad",
        price: 24.99,
        stock: 15,
        category: categories[1]._id,
        provider: providers[1]._id,
        image: "/placeholder.svg?height=400&width=300",
      },
      {
        name: "El principito",
        brand: "Antoine de Saint-Exupéry",
        description: "Un clásico de la literatura infantil",
        price: 12.99,
        stock: 40,
        category: categories[3]._id,
        provider: providers[2]._id,
        image: "/placeholder.svg?height=400&width=300",
      },
      {
        name: "1984",
        brand: "George Orwell",
        description: "Una distopía sobre el totalitarismo",
        price: 16.99,
        stock: 30,
        category: categories[0]._id,
        provider: providers[1]._id,
        image: "/placeholder.svg?height=400&width=300",
      },
      {
        name: "El poder del ahora",
        brand: "Eckhart Tolle",
        description: "Guía para la iluminación espiritual",
        price: 18.99,
        stock: 20,
        category: categories[4]._id,
        provider: providers[0]._id,
        image: "/placeholder.svg?height=400&width=300",
      },
    ])
    console.log("📖 Created products")

    // Create clients
    const clients = await Client.create([
      {
        name: "Pedro",
        lastName: "González",
        dni: "12345678A",
        email: "pedro@example.com",
        phone: "+34 600 111 222",
        address: "Calle Mayor 123, Madrid",
      },
      {
        name: "Laura",
        lastName: "Fernández",
        dni: "87654321B",
        email: "laura@example.com",
        phone: "+34 600 333 444",
        address: "Av. Libertad 45, Barcelona",
      },
      {
        name: "Miguel",
        lastName: "Sánchez",
        dni: "11223344C",
        email: "miguel@example.com",
        phone: "+34 600 555 666",
        address: "Plaza España 7, Valencia",
      },
    ])
    console.log("👤 Created clients")

    console.log("✅ Database seeded successfully!")
    console.log("\n📝 Test credentials:")
    console.log("Admin: admin@libreria.com / admin123")
    console.log("Employee: empleado@libreria.com / empleado123")
    console.log("Client: cliente@libreria.com / cliente123")

    process.exit(0)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  }
}

seedData()
