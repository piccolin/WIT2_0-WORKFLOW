/**
 * @Filename:    order-data-gateway.service.ts
 * @Type:        Service (Angular)
 * @Date:        2026-02-04
 * @Author:      Guido A. Piccolino Jr.
 *
 * @Description:
 * OrderDataGatewayService – Unified Order CRUD + Index Queries
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import type { Schema } from '../../../../../../../amplify/data/resource';
import { BaseDataGatewayService } from '../foundation/base-data-gateway.service';

export type Order = Schema['Order']['type'];
export type OrderCreate = Schema['Order']['createType'];
export type OrderUpdate = Schema['Order']['updateType'];

@Injectable({ providedIn: 'root' })
export class OrderDataGatewayService extends BaseDataGatewayService {

  public async createOrder(input: OrderCreate): Promise<Order | null> {
    return await this.safeCall('Order.create', () => this.client.models.Order.create(input));
  }

  public updateOrder(input: OrderUpdate): Promise<Order | null> {
    return this.safeCall('Order.update', () => this.client.models.Order.update(input));
  }

  // -----------------------------------------------------------------
  // Index Queries
  // -----------------------------------------------------------------

  public async listOrderByTypeAndNumber(type: Schema['OrderType']['type'], orderNumber: string): Promise<Array<Order>> {
    return this.safeCall('Order.listOrderByTypeAndNumber', async () => {
      // orderNumber is a Sort Key: must use { eq: orderNumber }
      const res = await this.client.models.Order.listOrderByTypeAndOrderNumber({
        type,
        orderNumber: { eq: orderNumber }
      });
      return { data: res.data as any, errors: res.errors };
    });
  }

  public async listOrderByRelatedOrder(relatedOrderId: string): Promise<Array<Order>> {
    return this.safeCall('Order.listOrderByRelatedOrder', async () => {
      const res = await this.client.models.Order.listOrderByRelatedOrderId({ relatedOrderId });
      return { data: res.data as any, errors: res.errors };
    });
  }

  // -----------------------------------------------------------------
  // Subscriptions
  // -----------------------------------------------------------------

  public onOrderUpdated(filter?: any): Observable<Order> {
    return this.asObservable((h) => this.client.models.Order.onUpdate(filter).subscribe({
      next: (data) => h.next(data as Order),
      error: (err) => h.error(err)
    }));
  }
}
