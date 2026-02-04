/**
 * @Filename:    cabinet-product-data-gateway.service.ts
 * @Type:        Service (Angular)
 * @Date:        2026-02-04
 * @Author:      Guido A. Piccolino Jr.
 *
 * @Description:
 * CabinetProductDataGatewayService – CabinetProduct model CRUD + subscriptions
 * - Uses listCabinetProductBywSku and listCabinetProductByvSku for SKU lookups
 * - Uses listCabinetProductByBrandAndDoorStyle for composite index queries
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import type { Schema } from '../../../../../../../amplify/data/resource';
import { BaseDataGatewayService } from '../foundation/base-data-gateway.service';

export type CabinetProduct = Schema['CabinetProduct']['type'];
export type CabinetProductCreate = Schema['CabinetProduct']['createType'];
export type CabinetProductUpdate = Schema['CabinetProduct']['updateType'];

@Injectable({ providedIn: 'root' })
export class CabinetProductDataGatewayService extends BaseDataGatewayService {

  public async createCabinetProduct(input: CabinetProductCreate): Promise<CabinetProduct | null> {
    return await this.safeCall('CabinetProduct.create', () => this.client.models.CabinetProduct.create(input));
  }

  public updateCabinetProduct(input: CabinetProductUpdate): Promise<CabinetProduct | null> {
    return this.safeCall('CabinetProduct.update', () => this.client.models.CabinetProduct.update(input));
  }

  public deleteCabinetProduct(id: string): Promise<CabinetProduct | null> {
    return this.safeCall('CabinetProduct.delete', () => this.client.models.CabinetProduct.delete({ id }));
  }

  // -----------------------------------------------------------------
  // Index Queries
  // -----------------------------------------------------------------

  public async listCabinetProductBywSku(wSKU: string): Promise<Array<CabinetProduct>> {
    return this.safeCall('CabinetProduct.listCabinetProductBywSku', async () => {
      const res = await this.client.models.CabinetProduct.listCabinetProductByWSKU({ wSKU });
      return { data: res.data as any, errors: res.errors };
    });
  }

  public async listCabinetProductByvSku(vSKU: string): Promise<Array<CabinetProduct>> {
    return this.safeCall('CabinetProduct.listCabinetProductByvSku', async () => {
      const res = await this.client.models.CabinetProduct.listCabinetProductByVSKU({ vSKU });
      return { data: res.data as any, errors: res.errors };
    });
  }

  public async listCabinetProductByBrandAndDoorStyle(brand: string, doorStyle: string): Promise<Array<CabinetProduct>> {
    return this.safeCall('CabinetProduct.listCabinetProductByBrandAndDoorStyle', async () => {
      // doorStyle is a Sort Key: must use { eq: doorStyle }
      const res = await this.client.models.CabinetProduct.listCabinetProductByBrandAndDoorStyle({
        brand,
        doorStyle: { eq: doorStyle }
      });
      return { data: res.data as any, errors: res.errors };
    });
  }

  // -----------------------------------------------------------------
  // Subscriptions
  // -----------------------------------------------------------------

  public onCabinetProductCreated(): Observable<CabinetProduct> {
    return this.asObservable((h) => this.client.models.CabinetProduct.onCreate().subscribe({
      next: (data) => h.next(data as CabinetProduct),
      error: (err) => h.error(err)
    }));
  }
}
