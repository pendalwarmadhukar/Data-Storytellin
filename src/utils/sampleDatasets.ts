import { Record } from '../types';

export const sampleDatasets = [
  {
    id: 'sales-q3',
    title: 'Q3 Global Sales & Regional Performance',
    description: 'Quarterly sales metrics across regions, product categories, discount rates, and profit margins.',
    fileName: 'global_sales_q3_2026.csv',
    rows: [
      { OrderID: 101, Region: 'North America', Category: 'Software', Revenue: 45000, Units: 120, Discount: 0.05, ProfitMargin: 0.42, Date: '2026-07-01' },
      { OrderID: 102, Region: 'Europe', Category: 'Hardware', Revenue: 62000, Units: 85, Discount: 0.10, ProfitMargin: 0.28, Date: '2026-07-03' },
      { OrderID: 103, Region: 'Asia-Pacific', Category: 'Services', Revenue: 31000, Units: 210, Discount: 0.00, ProfitMargin: 0.65, Date: '2026-07-05' },
      { OrderID: 104, Region: 'North America', Category: 'Hardware', Revenue: 89000, Units: 150, Discount: 0.15, ProfitMargin: 0.22, Date: '2026-07-10' },
      { OrderID: 105, Region: 'Latin America', Category: 'Software', Revenue: 21000, Units: 65, Discount: 0.00, ProfitMargin: 0.48, Date: '2026-07-12' },
      { OrderID: 106, Region: 'Europe', Category: 'Software', Revenue: 53000, Units: 140, Discount: 0.08, ProfitMargin: 0.40, Date: '2026-07-15' },
      { OrderID: 107, Region: 'Asia-Pacific', Category: 'Hardware', Revenue: 78000, Units: 110, Discount: 0.12, ProfitMargin: 0.25, Date: '2026-07-18' },
      { OrderID: 108, Region: 'North America', Category: 'Services', Revenue: 42000, Units: 190, Discount: 0.00, ProfitMargin: 0.60, Date: '2026-07-22' },
      { OrderID: 109, Region: 'Europe', Category: 'Services', Revenue: 38000, Units: 160, Discount: 0.05, ProfitMargin: 0.58, Date: '2026-07-25' },
      { OrderID: 110, Region: 'Latin America', Category: 'Hardware', Revenue: 29000, Units: 50, Discount: 0.20, ProfitMargin: 0.18, Date: '2026-07-28' },
      { OrderID: 111, Region: 'Asia-Pacific', Category: 'Software', Revenue: 67000, Units: 180, Discount: 0.05, ProfitMargin: 0.45, Date: '2026-08-02' },
      { OrderID: 112, Region: 'North America', Category: 'Software', Revenue: 94000, Units: 240, Discount: 0.10, ProfitMargin: 0.41, Date: '2026-08-06' }
    ]
  },
  {
    id: 'customer-churn',
    title: 'SaaS Customer Churn & Usage Analytics',
    description: 'Subscriber usage metrics, support ticket counts, monthly recurring revenue (MRR), and churn status.',
    fileName: 'saas_churn_analytics.csv',
    rows: [
      { CustomerID: 'C-1001', TenureMonths: 24, MonthlyCharges: 120.5, TotalSpent: 2892, SupportTickets: 1, ContractType: 'Annual', Churn: 'No' },
      { CustomerID: 'C-1002', TenureMonths: 3, MonthlyCharges: 45.0, TotalSpent: 135, SupportTickets: 5, ContractType: 'Monthly', Churn: 'Yes' },
      { CustomerID: 'C-1003', TenureMonths: 12, MonthlyCharges: 85.0, TotalSpent: 1020, SupportTickets: 2, ContractType: 'Annual', Churn: 'No' },
      { CustomerID: 'C-1004', TenureMonths: 1, MonthlyCharges: 95.0, TotalSpent: 95, SupportTickets: 4, ContractType: 'Monthly', Churn: 'Yes' },
      { CustomerID: 'C-1005', TenureMonths: 36, MonthlyCharges: 210.0, TotalSpent: 7560, SupportTickets: 0, ContractType: 'Annual', Churn: 'No' },
      { CustomerID: 'C-1006', TenureMonths: 6, MonthlyCharges: 65.0, TotalSpent: 390, SupportTickets: 3, ContractType: 'Monthly', Churn: 'Yes' },
      { CustomerID: 'C-1007', TenureMonths: 18, MonthlyCharges: 110.0, TotalSpent: 1980, SupportTickets: 1, ContractType: 'Annual', Churn: 'No' },
      { CustomerID: 'C-1008', TenureMonths: 2, MonthlyCharges: 50.0, TotalSpent: 100, SupportTickets: 4, ContractType: 'Monthly', Churn: 'Yes' },
      { CustomerID: 'C-1009', TenureMonths: 28, MonthlyCharges: 150.0, TotalSpent: 4200, SupportTickets: 0, ContractType: 'Annual', Churn: 'No' },
      { CustomerID: 'C-1010', TenureMonths: 9, MonthlyCharges: 75.0, TotalSpent: 675, SupportTickets: 2, ContractType: 'Monthly', Churn: 'No' }
    ]
  }
];
