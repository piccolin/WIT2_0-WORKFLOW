/**
 * @Filename:    order-item-data-gateway.service.ts
 * @Type:        Service (Angular)
 * @Date:        2026-02-04
 * @Author:      Guido A. Piccolino Jr.
 */

import { Injectable } from '@angular/core';
import type { Schema } from '../../../../../../../amplify/data/resource';
import { BaseDataGatewayService } from '../foundation/base-data-gateway.service';

export type OrderItem = Schema['OrderItem']['type'];
export type OrderItemCreate = Schema['OrderItem']['createType'];

@Injectable({ providedIn: 'root' })
export class OrderItemDataGatewayService extends BaseDataGatewayService {

  public async createOrderItem(input: OrderItemCreate): Promise<OrderItem | null> {
    return await this.safeCall('OrderItem.create', () => this.client.models.OrderItem.create(input));
  }

  public async listOrderItemsByOrderId(orderId: string): Promise<Array<OrderItem>> {
    return this.safeCall('OrderItem.list', async () => {
      // Standard filter requires { eq: orderId }
      const res = await this.client.models.OrderItem.list({
        filter: { orderId: { eq: orderId } }
      });
      return { data: res.data as any, errors: res.errors };
    });
  }
}
