⚡ ElectricityAPI

A .NET 10 web API to track electricity grid status and price information in Finland. The API aggregates real-time grid and price data from multiple external sources, providing a foundation for a modern React frontend dashboard.

🚀 Features
✅ Fetch real-time electricity grid status
✅ Retrieve hourly electricity prices
✅ Expose RESTful endpoints for a React frontend
✅ Modular backend ready for expansion with additional data sources
| Layer | Technology |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Backend | <img src="https://upload.wikimedia.org/wikipedia/commons/e/ee/.NET_Core_Logo.svg" alt=".NET 10 Aspire" width="40"/> **.NET 10 Aspire** |
| Frontend | <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React" width="40"/> **React** (in development) |
| Database | <img src="https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg" alt="PostgreSQL" width="40"/> **PostgreSQL** (planned) |
| Deployment | <img src="https://upload.wikimedia.org/wikipedia/commons/c/c5/Nginx_logo.svg" alt="NGINX" width="40"/> **NGINX** |

The backend will use PostgreSQL for storing historical grid and price data. The schema is designed to efficiently handle real-time updates and historical queries.

📦 Installation

This app is under development; backend API is ready for testing.

# Run backend API

dotnet run --project ElectricityAPI or start http.

🧩 API Endpoints (Planned)
GET /api/grid/status — Current status of the electricity grid
GET /api/price/hourly — Hourly electricity prices
GET /api/history — Historical electricity data (future)
🌱 Future Plans
Full React frontend dashboard for real-time monitoring
User authentication and custom notifications
Historical data analytics and graphs
Docker containerization for easy deployment
📖 References
.NET 10 Documentation
React Documentation
PostgreSQL Documentation

✨ Notes
!!Currently in early development. Some endpoints may be placeholders and are subject to change.
