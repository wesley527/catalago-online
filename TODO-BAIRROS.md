# TODO: Implementar Sistema de Bairros/Frete

## Steps to Complete:

### 1. [ ] DB Migration
- Criar `supabase/migrations/2024xxxx_create_delivery_areas.sql`: table delivery_areas (id, tenant_id, name, delivery_fee numeric).

### 2. [ ] Types
- `src/lib/types.ts`: Add DeliveryArea interface, update CheckoutData (+ delivery_type, delivery_area_id, delivery_fee).

### 3. [ ] Service
- Create `src/services/deliveryAreaService.ts`: getAll(tenantId), create, update, delete.

### 4. [ ] Admin Component
- Create `src/components/admin/DeliveryAreaManagement.tsx`: listagem, form crud bairro+valor.

### 5. [ ] AdminDashboard
- Add tab 'delivery' → DeliveryAreaManagement.

### 6. [ ] Checkout Updates
- CheckoutModal: Radio Retirada/Entrega, select bairros (fetch), total dinâmico = produtos + frete.
- Update orderService.createOrder (+ delivery_fee, area_id).

### 7. [ ] Apply Migration
- `supabase db push`

### 8. [ ] Test & Complete

