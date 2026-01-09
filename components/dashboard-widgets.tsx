import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ShoppingCart, TrendingUp } from "lucide-react";

export function LowStockWidget({ items }: { items: any[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
        <AlertTriangle className="h-4 w-4 text-yellow-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{items.length}</div>
        <p className="text-xs text-muted-foreground">Items near expiry or low quantity</p>
        <div className="mt-4 space-y-2">
          {items.slice(0, 3).map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.name}</span>
              <span className="text-red-500 font-medium">{item.quantity} {item.unit}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function RecentSalesWidget({ sales }: { sales: any[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Recent Sales</CardTitle>
        <TrendingUp className="h-4 w-4 text-green-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{sales.length}</div>
        <p className="text-xs text-muted-foreground">Sales today</p>
        <div className="mt-4 space-y-2">
          {sales.slice(0, 3).map((sale) => (
            <div key={sale.id} className="flex justify-between text-sm">
              <span>{sale.recipe.name}</span>
              <span className="font-medium">+{sale.quantity}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function ShoppingListWidget({ items }: { items: any[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Shopping List</CardTitle>
        <ShoppingCart className="h-4 w-4 text-blue-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{items.length}</div>
        <p className="text-xs text-muted-foreground">Recommended items to buy</p>
        <div className="mt-4 space-y-2">
          {items.slice(0, 3).map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.name}</span>
              <span className="text-muted-foreground">Restock needed</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
