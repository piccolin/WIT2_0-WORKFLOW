/**
 * @Filename:    order-integration-payload-data-gateway.service.ts
 * @Type:        Service (Angular)
 * @Date:        2026-02-04
 * @Author:      Guido A. Piccolino Jr.
 *
 * @Description:
 * OrderIntegrationPayloadDataGatewayService – IntegrationPayload model CRUD
 */

import { Injectable } from '@angular/core';
import type { Schema } from '../../../../../../../amplify/data/resource';
import { BaseDataGatewayService } from '../foundation/base-data-gateway.service';

export type OrderIntegrationPayload = Schema['OrderIntegrationPayload']['type'];
export type OrderIntegrationPayloadCreate = Schema['OrderIntegrationPayload']['createType'];

@Injectable({ providedIn: 'root' })
export class OrderIntegrationPayloadDataGatewayService extends BaseDataGatewayService {

  public async createIntegrationPayload(input: OrderIntegrationPayloadCreate): Promise<OrderIntegrationPayload | null> {
    return await this.safeCall('OrderIntegrationPayload.create', () => this.client.models.OrderIntegrationPayload.create(input));
  }

  public async listIntegrationPayloadByOrderId(orderId: string): Promise<Array<OrderIntegrationPayload>> {
    return this.safeCall('OrderIntegrationPayload.list', async () => {
      const res = await this.client.models.OrderIntegrationPayload.list({
        filter: { orderId: { eq: orderId } }
      });
      return { data: res.data as any, errors: res.errors };
    });
  }
}
