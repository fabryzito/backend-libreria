import mongoose from "mongoose"

const saleProductSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  productName: String,
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
})

const saleSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "El cliente es obligatorio"],
    },
    clientName: String,
    products: [saleProductSchema],
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "debit_card", "cash", "transfer"],
      required: [true, "El método de pago es obligatorio"],
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "completed",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
)

// Index for queries
saleSchema.index({ client: 1 })
saleSchema.index({ createdAt: -1 })
saleSchema.index({ status: 1 })

export default mongoose.model("Sale", saleSchema)
