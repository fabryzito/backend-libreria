import Sale from "../models/Sale.js"
import Product from "../models/Product.js"
import Client from "../models/Client.js"

// @desc    Get all sales
// @route   GET /api/sales
// @access  Private
export const getSales = async (req, res, next) => {
  try {
    const { clientId, startDate, endDate } = req.query

    const query = {}

    if (clientId) {
      query.client = clientId
    }

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }
    }

    const sales = await Sale.find(query)
      .populate("client", "name lastName")
      .populate("products.product", "name")
      .sort({ createdAt: -1 })

    const formattedSales = sales.map((sale) => ({
      id: sale._id,
      clientId: sale.client._id,
      clientName: sale.clientName || `${sale.client.name} ${sale.client.lastName}`,
      products: sale.products.map((p) => ({
        productId: p.product._id,
        productName: p.productName,
        quantity: p.quantity,
        price: p.price,
      })),
      total: sale.total,
      paymentMethod: sale.paymentMethod,
      status: sale.status,
      date: sale.createdAt.toISOString().split("T")[0],
    }))

    res.status(200).json({
      success: true,
      data: formattedSales,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single sale
// @route   GET /api/sales/:id
// @access  Private
export const getSale = async (req, res, next) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate("client", "name lastName")
      .populate("products.product", "name")

    if (!sale) {
      return res.status(404).json({
        success: false,
        error: "Venta no encontrada",
      })
    }

    res.status(200).json({
      success: true,
      data: {
        id: sale._id,
        clientId: sale.client._id,
        clientName: sale.clientName || `${sale.client.name} ${sale.client.lastName}`,
        products: sale.products.map((p) => ({
          productId: p.product._id,
          productName: p.productName,
          quantity: p.quantity,
          price: p.price,
        })),
        total: sale.total,
        paymentMethod: sale.paymentMethod,
        status: sale.status,
        date: sale.createdAt.toISOString().split("T")[0],
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create sale
// @route   POST /api/sales
// @access  Private
export const createSale = async (req, res, next) => {
  try {
    const { client, products, paymentMethod } = req.body

    // Verify client exists
    const clientDoc = await Client.findById(client)
    if (!clientDoc) {
      return res.status(404).json({
        success: false,
        error: "Cliente no encontrado",
      })
    }

    // Verify products and calculate total
    let total = 0
    const saleProducts = []

    for (const item of products) {
      const product = await Product.findById(item.product)

      if (!product) {
        return res.status(404).json({
          success: false,
          error: `Producto ${item.product} no encontrado`,
        })
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `Stock insuficiente para ${product.name}`,
        })
      }

      // Update product stock
      product.stock -= item.quantity
      await product.save()

      saleProducts.push({
        product: product._id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
      })

      total += product.price * item.quantity
    }

    // Create sale
    const sale = await Sale.create({
      client,
      clientName: `${clientDoc.name} ${clientDoc.lastName}`,
      products: saleProducts,
      total,
      paymentMethod,
      user: req.user._id,
    })

    const populatedSale = await Sale.findById(sale._id)
      .populate("client", "name lastName")
      .populate("products.product", "name")

    res.status(201).json({
      success: true,
      data: {
        id: populatedSale._id,
        clientId: populatedSale.client._id,
        clientName: populatedSale.clientName,
        products: populatedSale.products.map((p) => ({
          productId: p.product._id,
          productName: p.productName,
          quantity: p.quantity,
          price: p.price,
        })),
        total: populatedSale.total,
        paymentMethod: populatedSale.paymentMethod,
        status: populatedSale.status,
        date: populatedSale.createdAt.toISOString().split("T")[0],
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update sale status
// @route   PATCH /api/sales/:id/status
// @access  Private
export const updateSaleStatus = async (req, res, next) => {
  try {
    const { status } = req.body

    const sale = await Sale.findById(req.params.id)

    if (!sale) {
      return res.status(404).json({
        success: false,
        error: "Venta no encontrada",
      })
    }

    sale.status = status
    await sale.save()

    const populatedSale = await Sale.findById(sale._id)
      .populate("client", "name lastName")
      .populate("products.product", "name")

    res.status(200).json({
      success: true,
      data: {
        id: populatedSale._id,
        clientId: populatedSale.client._id,
        clientName: populatedSale.clientName,
        products: populatedSale.products.map((p) => ({
          productId: p.product._id,
          productName: p.productName,
          quantity: p.quantity,
          price: p.price,
        })),
        total: populatedSale.total,
        paymentMethod: populatedSale.paymentMethod,
        status: populatedSale.status,
        date: populatedSale.createdAt.toISOString().split("T")[0],
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get sales statistics
// @route   GET /api/sales/statistics
// @access  Private (Admin/Employee)
export const getSalesStatistics = async (req, res, next) => {
  try {
    const sales = await Sale.find()

    const totalSales = sales.length
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0)
    const completedSales = sales.filter((s) => s.status === "completed").length
    const pendingSales = sales.filter((s) => s.status === "pending").length

    res.status(200).json({
      success: true,
      data: {
        totalSales,
        totalRevenue,
        completedSales,
        pendingSales,
        averageSale: totalSales > 0 ? totalRevenue / totalSales : 0,
      },
    })
  } catch (error) {
    next(error)
  }
}
