# Feitsma Verhuizingen - Logistics & Delivery Management System

    // "dev": "tsx watch src/app.ts",
    // "build": "tsc",

A full-stack logistics and delivery management web application built with **Express.js**, **TypeScript**, **MongoDB**, and **Google Maps APIs**. Feitsma Verhuizingen optimizes route planning, manages shipments, and provides real-time delivery tracking for logistics operations.

## 🚀 Features

### Authentication & Security

- **Two-Factor Authentication (2FA)** via email verification
- JWT-based session management with secure, signed cookies
- Password hashing with bcryptjs
- Role-based access control on protected routes

### Shipment Management

- Create, read, update, and delete shipments
- Support for **mixed delivery & collection operations**
- Track shipment status: pending → transit → delivered/collected
- Search shipments by client name, phone, address, or delivery type
- Pagination support for large datasets

### Route Optimization

- **Vehicle Routing Problem with Pickup & Delivery (VRPPD)** solver
- Capacity-aware route planning with mixed delivery/collection stops
- **Nearest-neighbor TSP** with 2-opt improvements
- Dynamic capacity management (deliveries reduce load, collections increase it)
- Support for urgent shipments (priority loading)
- Chunked Google Distance Matrix API calls (respects 100-element hard limit)

### Maps & Geocoding

- Address geocoding (address → coordinates)
- Distance & time calculation between locations
- Place autocomplete suggestions
- Intelligent rate limiting for API calls

### Data Security & Validation

- MongoDB injection prevention (mongo-sanitize)
- XSS attack prevention (express-xss-sanitizer)
- Request rate limiting (100 requests per 15 minutes)
- Secure HTTP headers (Helmet)
- CORS protection with credential support

---

## 🛠 Tech Stack

### Backend

- **Framework**: Express.js 5.x
- **Language**: TypeScript 6.x
- **Runtime**: Node.js (with tsx for development)
- **Database**: MongoDB + Mongoose ODM
- **Authentication**: JWT + Bcryptjs
- **APIs**: Google Maps (Geocoding, Distance Matrix, Places)
- **Email**: Nodemailer (SMTP)

### Security Libraries

- `helmet` - Secure HTTP headers
- `express-rate-limit` - Rate limiting
- `mongo-sanitize` - NoSQL injection prevention
- `express-xss-sanitizer` - XSS protection
- `cookie-parser` - Signed cookie handling

### Utilities

- `axios` - HTTP requests
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token management
- `dotenv` - Environment configuration

---

## 📦 Installation

### Prerequisites

- **Node.js** v18+ (LTS recommended)
- **MongoDB** (local or cloud instance)
- **Google Maps API keys** (Geocoding, Distance Matrix, Places)
- **Gmail credentials** (for 2FA email delivery)

### Clone & Setup

```bash
# Clone the repository
git clone <repository-url>
cd deliverybackend

# Install dependencies
npm install

# Create .env file
cp .env.example .env  # (create this file with your credentials)
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PORT=4000
NODE_ENV=development

# Database
MONGO_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>

# Frontend
FRONTEND_URL=http://localhost:3000

# JWT & Cookies
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
COOKIE_SECRET=your-cookie-secret-key

# Google Maps
GOOGLE_MAPS_API=your-google-maps-api-key

# Depot Location (warehouse coordinates)
DEPOT_LAT=52.4002
DEPOT_LNG=4.6417

# Email (Gmail)
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password  # Use Gmail App Password, not your password
```

---

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
# Server runs on http://localhost:4000 with auto-reload
```

### Production Build

```bash
npm run build
npm start
# Server runs on http://localhost:4000
```

---

## 📚 API Endpoints

### Authentication Routes (`/api/users`)

| Method | Endpoint                      | Description                           |
| ------ | ----------------------------- | ------------------------------------- |
| POST   | `/send-2fa-code`              | Send 2FA code to email (signup)       |
| POST   | `/signup-verify-2fa-code`     | Verify code and create account        |
| POST   | `/login`                      | Login with email & password           |
| POST   | `/login-verify-2fa`           | Verify 2FA code during login          |
| POST   | `/resend-2fa-code`            | Resend 2FA code                       |
| POST   | `/send-email-forgot-password` | Send password reset code              |
| POST   | `/reset-password`             | Reset password with verification code |
| POST   | `/logout`                     | Logout (clear JWT cookie)             |

**Example**: Signup Flow

```bash
# Step 1: Send 2FA code
POST /api/users/send-2fa-code
{ "email": "user@example.com", "fullName": "John Doe", "password": "secret123" }

# Step 2: Verify code
POST /api/users/signup-verify-2fa-code
{ "email": "user@example.com", "code": "123456" }
```

### Shipment Routes (`/api/shipments`) - **Protected** ⛔

| Method | Endpoint                      | Description                                       |
| ------ | ----------------------------- | ------------------------------------------------- |
| GET    | `/`                           | Get all shipments (paginated)                     |
| GET    | `/home`                       | Get dashboard data (total, pending count, recent) |
| GET    | `/:id`                        | Get single shipment details                       |
| GET    | `/search?searchTerm=...`      | Search shipments by multiple fields               |
| GET    | `/more?limit=20&startIndex=0` | Load more shipments (pagination)                  |
| POST   | `/create`                     | Create new shipment                               |
| POST   | `/update`                     | Update shipment details                           |
| PATCH  | `/status`                     | Update shipment status (mark delivered)           |
| DELETE | `/:id`                        | Delete shipment                                   |

**Example**: Create Shipment

```bash
POST /api/shipments/create
{
  "clientName": "Jane Smith",
  "clientPhoneNumber": 5551234567,
  "deliveryAddress": "123 Main St, New York, NY",
  "boxQuantity": 5,
  "shipmentType": "delivery",
  "deliveryShift": "morning",
  "note": "Handle with care"
}
```

### Route Optimization Routes (`/api/routes`) - **Protected** ⛔

| Method | Endpoint        | Description                                   |
| ------ | --------------- | --------------------------------------------- |
| GET    | `/all`          | Get all routes for user                       |
| GET    | `/initial`      | Get unallocated shipments for route creation  |
| GET    | `/:id`          | Get single route details                      |
| POST   | `/create`       | Create optimized route (main algorithm)       |
| POST   | `/start`        | Mark shipments as "in transit"                |
| POST   | `/complete/:id` | Complete route (mark deliveries as delivered) |
| DELETE | `/delete/:id`   | Delete route                                  |

**Example**: Create Optimized Route

```bash
POST /api/routes/create
{
  "vehicleCapacity": 100,
  "deliveryShift": "morning",
  "routeType": "mixed"
}

Response:
{
  "success": true,
  "message": "Mixed route created: 8 delivery stops + 3 collection stops.",
  "data": {
    "route": { ... },
    "summary": {
      "totalStops": 11,
      "deliveryStops": 8,
      "collectionStops": 3,
      "vehicleCapacity": 100,
      "boxesLoadedAtDepot": 95,
      "deliveryUtilizationPct": 95
    },
    "stopManifest": [ ... ]
  }
}
```

### Maps Routes (`/api/maps`)

| Method | Endpoint                     | Description                       |
| ------ | ---------------------------- | --------------------------------- |
| GET    | `/get-suggestions?input=...` | Autocomplete address suggestions  |
| GET    | (internal)                   | Geocoding & distance calculations |

**Example**: Get Suggestions

```bash
GET /api/maps/get-suggestions?input=123%20Main%20St
Response: [
  {
    "id": 0,
    "display": "123 Main Street",
    "secondary": "New York, NY, USA",
    "message": { ... }
  }
]
```

---

## 🧠 Route Optimization Algorithm

The engine uses a **sophisticated VRPPD (Vehicle Routing Problem with Pickup & Delivery) solver**:

### Algorithm Flow

1. **Data Fetch**: Retrieve pending shipments (deliveries & collections) for a shift
2. **Urgent Priority**: Load urgent deliveries/collections first
3. **Greedy Packing**: Select deliveries (largest-first) up to vehicle capacity
4. **Distance Matrix**: Build NxN travel time matrix using Google Distance Matrix API
5. **Nearest-Neighbor TSP**: Order delivery stops starting from depot
6. **Dynamic Capacity Interleaving**: Insert collections greedily after each delivery
7. **2-Opt Refinement**: Optimize route by reversing sub-segments
8. **Validation**: Re-validate capacity compliance after optimization
9. **Persistence**: Save optimized route & update shipment statuses
10. **Manifest Generation**: Build stop-by-stop simulation

### Key Features

- ✅ **Capacity Awareness**: Deliveries free space, collections consume it
- ✅ **Mixed Routes**: Intelligently combine delivery & collection in one trip
- ✅ **Urgent Priority**: Fast-track urgent shipments to loading
- ✅ **API Limits**: Chunk Distance Matrix calls (max 100 elements/request)
- ✅ **Error Handling**: Detailed error messages with debug info

### Example Route Manifest

```json
{
  "stopNumber": 1,
  "action": "DROP",
  "client": "John Doe",
  "address": "456 Oak Ave",
  "boxes": 10,
  "boxesBefore": 95,
  "boxesAfter": 85,
  "capacityUsedPct": 85,
  "shipmentType": "delivery"
}
```

---

## 📁 Project Structure

```
src/
├── app.ts                          # Express app entry point
├── config/
│   └── db.ts                       # MongoDB connection
├── controllers/
│   ├── user.controller.ts          # Auth endpoints
│   ├── shipment.controller.ts      # Shipment CRUD & status
│   ├── optimizedRoute.controller.ts # Route optimization handlers
│   └── map.controller.ts           # Maps & geocoding
├── routes/
│   ├── users.route.ts
│   ├── shipments.route.ts
│   ├── optimizedRoute.route.ts
│   └── maps.route.ts
├── services/
│   ├── efficientRoute.service.ts   # VRPPD algorithm & logic
│   └── map.service.ts              # Google Maps API calls
├── models/
│   ├── User.ts                     # User schema
│   ├── Shipment.ts                 # Shipment schema
│   └── Route.ts                    # Route schema
├── utils/
│   ├── checkLogin.ts               # JWT middleware
│   └── genarateToken.ts            # Token generation
├── emails/
│   ├── emailHandler.ts             # Nodemailer setup
│   └── emailTemplates.ts           # HTML email templates
└── package.json
```

---

## 🔐 Security Features

### Request Validation

- Query parameter type coercion & bounds checking
- Required field validation before DB queries
- Owner authorization on all protected routes

### Database Protection

- MongoDB injection prevention via `mongo-sanitize`
- Mongoose schema validation

### API Security

- Rate limiting: 100 requests/15 minutes per IP
- CORS with credentials: Only `FRONTEND_URL`
- Helmet: Secure headers (CSP, X-Frame-Options, etc.)
- XSS sanitization: `express-xss-sanitizer`

### Authentication

- JWT tokens: Signed, httpOnly cookies
- Secure cookie settings: `sameSite=none, secure=true, httpOnly=true`
- 2FA verification: 6-digit codes with 1-minute expiry

---

## 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "message": "Error description",
  "error": "Optional error object"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized (no token)
- `404` - Not Found
- `422` - Unprocessable (validation failed)
- `500` - Internal Server Error
- `502` - Bad Gateway (external API failure)

---

## 🔧 Troubleshooting

### "Unauthorized: No token provided"

- Ensure client sends JWT cookie in requests
- Cookie must be signed with same `COOKIE_SECRET`

### "Distance Matrix API error [REQUEST_DENIED]"

- Verify `GOOGLE_MAPS_API` key is valid
- Enable Distance Matrix API in Google Cloud Console
- Check API key restrictions (should be unrestricted or only allow Maps APIs)

### "No unallocated shipments found"

- Ensure shipments exist with status `pending` (not delivered/transit)
- Check `deliveryShift` matches shipment's shift
- Verify shipments belong to the authenticated user

### MongoDB Connection Failed

- Check `MONGO_URL` format and credentials
- Ensure MongoDB service is running
- For cloud (Atlas): Whitelist your IP in network access

### Emails Not Sending

- Verify Gmail credentials and app-specific password
- Enable "Less secure app access" or use [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- Check SMTP settings: `smtp.gmail.com:587`

---

## 📊 Database Schema Overview

### User

```typescript
{
  _id: ObjectId,
  fullName: string,
  email: string (unique),
  password: string (hashed),
  isVerified: boolean,
  twoFaCode: number,
  createdAt: Date,
  updatedAt: Date
}
```

### Shipment

```typescript
{
  _id: ObjectId,
  OwnerRef: ObjectId (User),
  clientName: string,
  clientPhoneNumber: number,
  pickupAddress: string,
  deliveryAddress: string,
  deliverySelected: { lat: number, lng: number },
  boxQuantity: number,
  shipmentType: "delivery" | "collection",
  deliveryShift: "morning" | "afternoon" | "evening" | "night" | "fullday",
  status: "pending" | "transit" | "delivered" | "collected" | "completed",
  isUrgent: boolean,
  note: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Route

```typescript
{
  _id: ObjectId,
  OwnerRef: ObjectId (User),
  vehicleCapacity: number,
  deliveryShift: string,
  totalBoxes: number,
  status: "scheduled" | "active" | "completed" | "cancelled",
  shipments: [Shipment],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚀 Performance Optimization

### Distance Matrix Chunking

- Limits API calls to 9×9 = 81 elements per request (under Google's 100-element hard cap)
- Implements rate limiting (120ms between calls) to avoid QPS throttling
- Scales to 625 elements for "Maps Platform Premium" plan (adjust `CHUNK_ORIGINS`/`CHUNK_DESTS`)

### Database Queries

- Uses `.lean()` for read-only queries (faster, lower memory)
- Indexes on `OwnerRef` for faster user-based filtering
- Pagination support (limit/skip) for large datasets

### Caching

- Considers implementing Redis for frequently accessed routes/shipments
- 2FA codes auto-expire after 60 seconds

---

## 📝 Development Guidelines

### Code Style

- TypeScript with strict mode enabled
- Explicit type annotations on all functions
- Named interface exports for reusability
- Error handling with try-catch blocks

### Adding New Routes

1. Create controller function with typed parameters
2. Define route in corresponding `.route.ts` file
3. Add `checkLogin` middleware for protected routes
4. Update this README with endpoint documentation

### Contributing

1. Create a feature branch: `git checkout -b feature/new-feature`
2. Commit changes: `git commit -m "Add new feature"`
3. Push to branch: `git push origin feature/new-feature`
4. Submit a Pull Request

---

## 📞 Support & Contact

For issues, feature requests, or questions:

- **Author**: Tanvir Anjum
- **Email**: tanvir@example.com
- **GitHub**: [Feitsma Verhuizingen Repository](https://github.com/yourusername/Feitsma Verhuizingen)

---

## 📄 License

This project is licensed under the ISC License. See LICENSE file for details.

---

## 🙏 Acknowledgments

- Google Maps Platform for geocoding and distance matrix APIs
- Express.js community for excellent middleware ecosystem
- MongoDB for flexible document storage
- All contributors and testers

---

**Happy shipping! 🚚** Let Feitsma Verhuizingen optimize your logistics workflow.
