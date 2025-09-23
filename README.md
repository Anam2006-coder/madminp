# 🏛️ Admin Dashboard - Complaint Management System

A modern, responsive Admin Dashboard web application built with React, TypeScript, Tailwind CSS, and shadcn/ui for managing citizen complaints with role-based access control.

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## ✨ Features

### 🔐 Authentication & Authorization
- **Role-based login system**
  - Main Admin: Access to all complaints, analytics, and system-wide overview
  - Sub Admin: Department-specific access with complaint management capabilities
- Persistent login with localStorage
- Demo credentials provided for easy testing

### 📋 Smart Complaint Management
- **Comprehensive complaint tracking** with fields:
  - ID, citizen name, department, description, **photo**, location
  - Priority (High/Medium/Low), status tracking, timestamps
- **Smart routing system** - Auto-assigns complaints to departments based on keywords
- **Status workflow**: New → Seen → Assigned → In Progress → Completed → Closed
- **🖼️ Image preview** - View photos uploaded by citizens
- **Advanced filtering** - Filter by photo presence, status, department, priority

### ⏰ Priority & SLA System
- **Auto-priority assignment** based on complaint content
- **Department-specific SLA deadlines**:
  - Garbage: 24 hours
  - Health: 24 hours  
  - Electricity: 48 hours
  - Water: 48 hours
  - Roads: 72 hours
  - Education: 72 hours
- **Real-time SLA tracking** with visual alerts:
  - 🟢 Within SLA
  - 🟡 Approaching deadline
  - 🔴 Overdue (highlighted in red)

### 📊 Main Admin Dashboard
- **System-wide overview** with all departments
- **Key metrics**: Total complaints, pending, resolved today, overdue count
- **Analytics section**:
  - Department-wise complaint distribution
  - Average resolution times
  - Priority and status breakdowns
  - SLA compliance metrics
- **Interactive charts**: Bar charts, pie charts, line graphs
- **Performance tracking**: Department rankings, resolution rates

### 👥 Sub Admin Dashboard  
- **Department-specific view** - Only see complaints for their department
- **Status update workflow** - Step-by-step complaint resolution
- **Worker assignment** capabilities with notes
- **Progress tracking** with visual status indicators

### 🎨 Modern UI/UX
- **Clean, minimal design** using Tailwind CSS
- **Responsive layout** - Works on desktop, tablet, and mobile
- **Sidebar navigation** with Dashboard, Complaints, Analytics tabs
- **shadcn/ui components** for consistent design system
- **Advanced filtering & search**:
  - Search by citizen name, description, location, ID
  - Filter by status, department, priority, photo presence
  - Sorting by date, priority
  - Active filter badges

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components  
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **State Management**: React Context + useState
- **Data**: Mock API with in-memory state (easily replaceable)

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/admin-dashboard.git
   cd admin-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   - Navigate to `http://localhost:3000`
   - The application will automatically open

## 🔐 Demo Credentials

### Main Admin (Full Access)
- **Username**: `admin`
- **Password**: `password`
- **Access**: All departments, analytics, system overview

### Sub Admins (Department-Specific)
- **Water Admin**: `water_admin` / `password`
- **Roads Admin**: `roads_admin` / `password`  
- **Electricity Admin**: `electricity_admin` / `password`
- **Garbage Admin**: `garbage_admin` / `password`
- **Health Admin**: `health_admin` / `password`
- **Education Admin**: `education_admin` / `password`

## 📊 Sample Data

The application comes pre-loaded with 50+ sample complaints across all departments to demonstrate:
- Various complaint types and priorities
- Different status stages
- SLA compliance scenarios
- Department distribution
- Time-based analytics
- **Photo attachments** for visual evidence

## 🎯 Key Functionalities

### For Main Admins
1. **System Overview**: View all complaints across departments
2. **Analytics Dashboard**: Comprehensive insights and performance metrics
3. **Department Performance**: Compare resolution rates and SLA compliance
4. **Strategic Planning**: Use data to allocate resources and improve processes
5. **Photo Management**: View all citizen-uploaded photos

### For Sub Admins  
1. **Department Focus**: Manage complaints specific to their department
2. **Workflow Management**: Update complaint status through defined workflow
3. **Worker Coordination**: Assign workers and add progress notes
4. **Performance Tracking**: Monitor department-specific metrics
5. **Photo Review**: View photos for their department's complaints

### Universal Features
- **Real-time Updates**: Complaint status changes reflect immediately
- **Search & Filter**: Powerful tools to find specific complaints quickly
- **Responsive Design**: Works seamlessly across all device sizes
- **Visual Indicators**: Color-coded priority, status, and SLA alerts
- **Image Preview**: Full-screen photo viewing with complaint details

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui base components
│   ├── Login.tsx       # Authentication
│   ├── Sidebar.tsx     # Navigation
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Complaints.tsx  # Complaint management
│   ├── ComplaintCard.tsx # Individual complaint cards
│   └── Analytics.tsx   # Analytics dashboard
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state
├── data/              # Mock data and services  
│   └── mockData.ts    # Sample complaints and users
├── services/          # Business logic
│   └── smartRouting.ts # Auto-categorization
├── types/            # TypeScript definitions
│   └── index.ts      # Type definitions
├── lib/              # Utilities
│   └── utils.ts      # Helper functions
└── App.tsx           # Main application
```

## 🔄 Future Enhancements

### Backend Integration
- Replace mock data with real API endpoints
- Add database persistence (MongoDB, PostgreSQL, etc.)
- Implement proper authentication with JWT tokens
- Add file upload capabilities for photos

### Advanced Features
- **Real-time notifications** using WebSockets
- **Email/SMS alerts** for SLA breaches
- **Map integration** for location visualization
- **Advanced reporting** with PDF exports
- **Audit trails** for complaint history
- **Multi-language support**
- **Mobile app** companion

### Analytics Enhancements
- **Predictive analytics** for complaint volumes
- **Machine learning** for auto-categorization
- **Advanced dashboards** with custom widgets
- **Export capabilities** for reports

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - The web framework used
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Recharts](https://recharts.org/) - Chart library
- [Lucide React](https://lucide.dev/) - Icon library

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**

⭐ **Star this repository if you found it helpful!**#   n e w _ m _ a d m i n _ p r o t o t y p e  
 