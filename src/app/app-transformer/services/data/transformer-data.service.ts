import { Injectable } from '@angular/core';
import {IntegrationPayloadGraphqlService} from "@app/app-data/services/stores/graphql/integration-payload-graphql.service";
import {SalesOrderGraphqlService} from "@app/app-data/services/stores/graphql/sales-order-graphql.service";
import {SalesOrderItemsGraphqlService} from "@app/app-data/services/stores/graphql/sales-order-items-graphql.service";
import {CreateIntegrationPayloadMutation, SalesOrder, SalesOrderItems} from "@scr/API";

@Injectable({ providedIn: 'root' })
export class TransformerDataService  {
  constructor(private readonly integrationPayloadGraphqlService: IntegrationPayloadGraphqlService,
              private readonly salesOrderGraphqlService: SalesOrderGraphqlService,
              private readonly salesOrderItemsGraphqlService: SalesOrderItemsGraphqlService) {
  }

  // async createIntegrationPayload(input: {}){
  //     let result = await this.integrationPayloadGraphqlService.createIntegrationPayload(input)
  //     return result?.data?.createIntegrationPayload
  // }

  async createIntegrationPayload(input: {}){
  // Call service to create (returns typed Observable)
    this.integrationPayloadGraphqlService.createIntegrationPayload(input).subscribe({
                                                              next: (result: CreateIntegrationPayloadMutation) => {
  console.log('✅ Created IntegrationPayload:', result.createIntegrationPayload);
  },
  error: (err) => {
    console.error('❌ Create failed:', err);
  }
  });
}

  async createSalesOrder(input: {}){
    let result = this.salesOrderGraphqlService.createSalesOrder(input);
    //return result?.data?.createSalesOrder
  }

  async createSalesOrderItem(input: {}){
    let result = this.salesOrderItemsGraphqlService.createSalesOrderItems(input)
    //return result?.data?.createSalesOrderItems
  }

  async createSalesOrderAndItems(partialSalesOrder: Partial<SalesOrder>, partialSalesOrderItems: Array<Partial<SalesOrderItems>>){
    // let salesOrder: SalesOrder = await this.createSalesOrder(partialSalesOrder)
    // let salesOrderId = salesOrder.id
    //
    // let promises = partialSalesOrderItems.map((salesOrderItem) => {
    //   salesOrderItem.salesOrderItemsId = salesOrderId
    //   this.createSalesOrderItem(salesOrderItem)
    // })
    // await Promise.all(promises)
  }

}//end class
