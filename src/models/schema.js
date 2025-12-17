export const schema = {
    "models": {
        "CabinetProduct": {
            "name": "CabinetProduct",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "wSKU": {
                    "name": "wSKU",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "vSKU": {
                    "name": "vSKU",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "brand": {
                    "name": "brand",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "doorStyle": {
                    "name": "doorStyle",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "cabinetType": {
                    "name": "cabinetType",
                    "isArray": false,
                    "type": {
                        "enum": "CabinetType"
                    },
                    "isRequired": true,
                    "attributes": []
                },
                "cabinetSubType": {
                    "name": "cabinetSubType",
                    "isArray": false,
                    "type": {
                        "enum": "AssemblyType"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "productType": {
                    "name": "productType",
                    "isArray": false,
                    "type": {
                        "enum": "ProductType"
                    },
                    "isRequired": true,
                    "attributes": []
                },
                "productSubType": {
                    "name": "productSubType",
                    "isArray": false,
                    "type": {
                        "enum": "ProductSubType"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "retailPrice": {
                    "name": "retailPrice",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "discountScalingOn": {
                    "name": "discountScalingOn",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "discountScalingOff": {
                    "name": "discountScalingOff",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "listPrice": {
                    "name": "listPrice",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "assemblyMarkupFactor": {
                    "name": "assemblyMarkupFactor",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "assemblyFee": {
                    "name": "assemblyFee",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "costFactor": {
                    "name": "costFactor",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "unitCost": {
                    "name": "unitCost",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "doesVendorAssemble": {
                    "name": "doesVendorAssemble",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "vendorAssemblyCost": {
                    "name": "vendorAssemblyCost",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "waverlyAssemblyCost": {
                    "name": "waverlyAssemblyCost",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "height": {
                    "name": "height",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "width": {
                    "name": "width",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "weight": {
                    "name": "weight",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "line": {
                    "name": "line",
                    "isArray": false,
                    "type": {
                        "enum": "CabinetLine"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "finish": {
                    "name": "finish",
                    "isArray": false,
                    "type": {
                        "enum": "FinishType"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "finishColor": {
                    "name": "finishColor",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "overlay": {
                    "name": "overlay",
                    "isArray": false,
                    "type": {
                        "enum": "OverlayType"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "boxConstruction": {
                    "name": "boxConstruction",
                    "isArray": false,
                    "type": {
                        "enum": "BoxConstructionType"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "doors": {
                    "name": "doors",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "drawers": {
                    "name": "drawers",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "shelves": {
                    "name": "shelves",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "species": {
                    "name": "species",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "shippingClass": {
                    "name": "shippingClass",
                    "isArray": false,
                    "type": {
                        "enum": "AssemblyType"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "fullHeight": {
                    "name": "fullHeight",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "pantry": {
                    "name": "pantry",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "oven": {
                    "name": "oven",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "corner": {
                    "name": "corner",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "blindCabinet": {
                    "name": "blindCabinet",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "flipUpDoor": {
                    "name": "flipUpDoor",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "pullout": {
                    "name": "pullout",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "sink": {
                    "name": "sink",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "numberOfSinks": {
                    "name": "numberOfSinks",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "microwave": {
                    "name": "microwave",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "microWaveDrawer": {
                    "name": "microWaveDrawer",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "range": {
                    "name": "range",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "rangeDrawer": {
                    "name": "rangeDrawer",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "desk": {
                    "name": "desk",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "lineDrawingImagePath": {
                    "name": "lineDrawingImagePath",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "doorStyleImagePath": {
                    "name": "doorStyleImagePath",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "tags": {
                    "name": "tags",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "stockItem": {
                    "name": "stockItem",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "availableForPickup": {
                    "name": "availableForPickup",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "publish": {
                    "name": "publish",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "CabinetProducts",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "bywSku",
                        "queryField": "listCabinetProductBywSku",
                        "fields": [
                            "wSKU"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byvSku",
                        "queryField": "listCabinetProductByvSku",
                        "fields": [
                            "vSKU"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byBrandAndDoorStyle",
                        "queryField": "listCabinetProductByBrandAndDoorStyle",
                        "fields": [
                            "brand",
                            "doorStyle"
                        ]
                    }
                }
            ]
        },
        "SalesOrder": {
            "name": "SalesOrder",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "email": {
                    "name": "email",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "phoneNumber": {
                    "name": "phoneNumber",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "source": {
                    "name": "source",
                    "isArray": false,
                    "type": {
                        "enum": "OrderSource"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "vendor": {
                    "name": "vendor",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "vendorNumber": {
                    "name": "vendorNumber",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "doorStyles": {
                    "name": "doorStyles",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "PurchaseOrderId": {
                    "name": "PurchaseOrderId",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "customerRef": {
                    "name": "customerRef",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "salesRepRef": {
                    "name": "salesRepRef",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "transactionID": {
                    "name": "transactionID",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "transactionNumber": {
                    "name": "transactionNumber",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "transactionDate": {
                    "name": "transactionDate",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "paymentStatus": {
                    "name": "paymentStatus",
                    "isArray": false,
                    "type": {
                        "enum": "PaymentStatus"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "orderStatus": {
                    "name": "orderStatus",
                    "isArray": false,
                    "type": {
                        "enum": "OrderStatus"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "fulfillmentStatus": {
                    "name": "fulfillmentStatus",
                    "isArray": false,
                    "type": {
                        "enum": "FulfillmentStatus"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "shippingStatus": {
                    "name": "shippingStatus",
                    "isArray": false,
                    "type": {
                        "enum": "ShippingStatus"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "billing": {
                    "name": "billing",
                    "isArray": false,
                    "type": {
                        "nonModel": "Address"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "shipping": {
                    "name": "shipping",
                    "isArray": false,
                    "type": {
                        "nonModel": "Address"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "dueDate": {
                    "name": "dueDate",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "shipDate": {
                    "name": "shipDate",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "estimatedDeliveryDate": {
                    "name": "estimatedDeliveryDate",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "subtotal": {
                    "name": "subtotal",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "taxAmount": {
                    "name": "taxAmount",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "shippingAmount": {
                    "name": "shippingAmount",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "discountAmount": {
                    "name": "discountAmount",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "totalAmount": {
                    "name": "totalAmount",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "paymentMethod": {
                    "name": "paymentMethod",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "paymentGateway": {
                    "name": "paymentGateway",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "currency": {
                    "name": "currency",
                    "isArray": false,
                    "type": {
                        "enum": "CurrencyCode"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "shippingMethod": {
                    "name": "shippingMethod",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "trackingNumber": {
                    "name": "trackingNumber",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "trackingURL": {
                    "name": "trackingURL",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "carrier": {
                    "name": "carrier",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "notes": {
                    "name": "notes",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "customerNotes": {
                    "name": "customerNotes",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "metadata": {
                    "name": "metadata",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "items": {
                    "name": "items",
                    "isArray": true,
                    "type": {
                        "model": "SalesOrderItems"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "salesOrderItemsId"
                        ]
                    }
                },
                "payloads": {
                    "name": "payloads",
                    "isArray": true,
                    "type": {
                        "model": "IntegrationPayload"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "salesOrderPayloadsId"
                        ]
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "SalesOrders",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                }
            ]
        },
        "SalesOrderItems": {
            "name": "SalesOrderItems",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "txnLineID": {
                    "name": "txnLineID",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "PurchaseOrderId": {
                    "name": "PurchaseOrderId",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "itemListID": {
                    "name": "itemListID",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "itemFullName": {
                    "name": "itemFullName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "description": {
                    "name": "description",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "assembly": {
                    "name": "assembly",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "quantity": {
                    "name": "quantity",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "rate": {
                    "name": "rate",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "total": {
                    "name": "total",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "invoiced": {
                    "name": "invoiced",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "salesOrderItemsId": {
                    "name": "salesOrderItemsId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "SalesOrderItems",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "gsi-SalesOrder.items",
                        "fields": [
                            "salesOrderItemsId"
                        ]
                    }
                }
            ]
        },
        "PurchaseOrder": {
            "name": "PurchaseOrder",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "SalesOrderId": {
                    "name": "SalesOrderId",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "vendor": {
                    "name": "vendor",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "vendorAddress": {
                    "name": "vendorAddress",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "vendorNumber": {
                    "name": "vendorNumber",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "doorStyles": {
                    "name": "doorStyles",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "orderStatus": {
                    "name": "orderStatus",
                    "isArray": false,
                    "type": {
                        "enum": "OrderStatus"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "fulfillmentStatus": {
                    "name": "fulfillmentStatus",
                    "isArray": false,
                    "type": {
                        "enum": "FulfillmentStatus"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "shippingStatus": {
                    "name": "shippingStatus",
                    "isArray": false,
                    "type": {
                        "enum": "ShippingStatus"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "shipping": {
                    "name": "shipping",
                    "isArray": false,
                    "type": {
                        "nonModel": "Address"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "dueDate": {
                    "name": "dueDate",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "shipDate": {
                    "name": "shipDate",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "estimatedDeliveryDate": {
                    "name": "estimatedDeliveryDate",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "shippingMethod": {
                    "name": "shippingMethod",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "trackingNumber": {
                    "name": "trackingNumber",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "trackingURL": {
                    "name": "trackingURL",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "carrier": {
                    "name": "carrier",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "notes": {
                    "name": "notes",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "metadata": {
                    "name": "metadata",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "items": {
                    "name": "items",
                    "isArray": true,
                    "type": {
                        "model": "PurchaseOrderItems"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "purchaseOrderItemsId"
                        ]
                    }
                },
                "payloads": {
                    "name": "payloads",
                    "isArray": true,
                    "type": {
                        "model": "IntegrationPayload"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "purchaseOrderPayloadsId"
                        ]
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "PurchaseOrders",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                }
            ]
        },
        "PurchaseOrderItems": {
            "name": "PurchaseOrderItems",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "customer": {
                    "name": "customer",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "itemListID": {
                    "name": "itemListID",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "itemFullName": {
                    "name": "itemFullName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "description": {
                    "name": "description",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "assembly": {
                    "name": "assembly",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "quantity": {
                    "name": "quantity",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "rate": {
                    "name": "rate",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "total": {
                    "name": "total",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "purchaseOrderItemsId": {
                    "name": "purchaseOrderItemsId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "PurchaseOrderItems",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "gsi-PurchaseOrder.items",
                        "fields": [
                            "purchaseOrderItemsId"
                        ]
                    }
                }
            ]
        },
        "ConfirmationOrder": {
            "name": "ConfirmationOrder",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "PurchaseOrderId": {
                    "name": "PurchaseOrderId",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "SalesOrderId": {
                    "name": "SalesOrderId",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "vendor": {
                    "name": "vendor",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "salesPerson": {
                    "name": "salesPerson",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "quoteDate": {
                    "name": "quoteDate",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "style": {
                    "name": "style",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "billingContact": {
                    "name": "billingContact",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "billing": {
                    "name": "billing",
                    "isArray": false,
                    "type": {
                        "nonModel": "Address"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "shippingContact": {
                    "name": "shippingContact",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "shipping": {
                    "name": "shipping",
                    "isArray": false,
                    "type": {
                        "nonModel": "Address"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "shippingMethod": {
                    "name": "shippingMethod",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "trackingNumber": {
                    "name": "trackingNumber",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "carrier": {
                    "name": "carrier",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "subtotal": {
                    "name": "subtotal",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "upgrades": {
                    "name": "upgrades",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "modifications": {
                    "name": "modifications",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "taxAmount": {
                    "name": "taxAmount",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "shippingAmount": {
                    "name": "shippingAmount",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "discountAmount": {
                    "name": "discountAmount",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "totalAmount": {
                    "name": "totalAmount",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "items": {
                    "name": "items",
                    "isArray": true,
                    "type": {
                        "model": "ConfirmationOrderItems"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "confirmationOrderItemsId"
                        ]
                    }
                },
                "payloads": {
                    "name": "payloads",
                    "isArray": true,
                    "type": {
                        "model": "IntegrationPayload"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": [
                            "confirmationOrderPayloadsId"
                        ]
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "ConfirmationOrders",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                }
            ]
        },
        "ConfirmationOrderItems": {
            "name": "ConfirmationOrderItems",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "PurchaseOrderId": {
                    "name": "PurchaseOrderId",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "itemFullName": {
                    "name": "itemFullName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "description": {
                    "name": "description",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "quantity": {
                    "name": "quantity",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "rate": {
                    "name": "rate",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "total": {
                    "name": "total",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "estDeliveryDate": {
                    "name": "estDeliveryDate",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "confirmationOrderItemsId": {
                    "name": "confirmationOrderItemsId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "ConfirmationOrderItems",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "gsi-ConfirmationOrder.items",
                        "fields": [
                            "confirmationOrderItemsId"
                        ]
                    }
                }
            ]
        },
        "IntegrationPayload": {
            "name": "IntegrationPayload",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "type": {
                    "name": "type",
                    "isArray": false,
                    "type": {
                        "enum": "PayLoadType"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "source": {
                    "name": "source",
                    "isArray": false,
                    "type": {
                        "enum": "OrderSource"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "externalId": {
                    "name": "externalId",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "receivedAt": {
                    "name": "receivedAt",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "payload": {
                    "name": "payload",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "salesOrderPayloadsId": {
                    "name": "salesOrderPayloadsId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "purchaseOrderPayloadsId": {
                    "name": "purchaseOrderPayloadsId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "confirmationOrderPayloadsId": {
                    "name": "confirmationOrderPayloadsId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "IntegrationPayloads",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "gsi-SalesOrder.payloads",
                        "fields": [
                            "salesOrderPayloadsId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "gsi-PurchaseOrder.payloads",
                        "fields": [
                            "purchaseOrderPayloadsId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "gsi-ConfirmationOrder.payloads",
                        "fields": [
                            "confirmationOrderPayloadsId"
                        ]
                    }
                }
            ]
        }
    },
    "enums": {
        "CabinetType": {
            "name": "CabinetType",
            "values": [
                "WALL",
                "BASE",
                "TALL",
                "VANITY",
                "SAMPLE_DOOR",
                "SAMPLE_FRONT"
            ]
        },
        "AssemblyType": {
            "name": "AssemblyType",
            "values": [
                "RTA",
                "ASSEMBLED"
            ]
        },
        "ProductType": {
            "name": "ProductType",
            "values": [
                "CABINET",
                "FILLER",
                "MOULDING",
                "PANEL",
                "EDGE_BANDING",
                "WALL_HANGING_KIT",
                "FLOATING_WALL_SHELF",
                "STORAGE_ACCESSORY",
                "TOUCHUP_KIT"
            ]
        },
        "ProductSubType": {
            "name": "ProductSubType",
            "values": [
                "PULLOUT_ORGANIZER",
                "TRASH",
                "SINK_TILT_OUT",
                "INSIDE_DRAWER",
                "INSIDE_DOOR",
                "PAINT",
                "STAIN"
            ]
        },
        "CabinetLine": {
            "name": "CabinetLine",
            "values": [
                "ENTRY",
                "PREMIUM",
                "CUSTOM"
            ]
        },
        "FinishType": {
            "name": "FinishType",
            "values": [
                "PAINTED",
                "STAINED",
                "THERMOFOIL"
            ]
        },
        "OverlayType": {
            "name": "OverlayType",
            "values": [
                "FULL",
                "PARTIAL",
                "INSET"
            ]
        },
        "BoxConstructionType": {
            "name": "BoxConstructionType",
            "values": [
                "FRAMED",
                "FRAMELESS"
            ]
        },
        "OrderSource": {
            "name": "OrderSource",
            "values": [
                "WOOCOMMERCE",
                "PROKITCHEN",
                "MANUAL_ENTRY"
            ]
        },
        "OrderStatus": {
            "name": "OrderStatus",
            "values": [
                "DRAFT",
                "OPEN",
                "CONFIRMED",
                "CLOSED",
                "CANCELLED"
            ]
        },
        "FulfillmentStatus": {
            "name": "FulfillmentStatus",
            "values": [
                "UNFULFILLED",
                "PARTIAL",
                "FULFILLED",
                "BACKORDERED"
            ]
        },
        "ShippingStatus": {
            "name": "ShippingStatus",
            "values": [
                "NOT_SHIPPED",
                "PARTIAL",
                "SHIPPED",
                "DELIVERED"
            ]
        },
        "PaymentStatus": {
            "name": "PaymentStatus",
            "values": [
                "UNPAID",
                "PARTIAL",
                "PAID",
                "REFUNDED",
                "VOIDED"
            ]
        },
        "CurrencyCode": {
            "name": "CurrencyCode",
            "values": [
                "USD",
                "CAD",
                "EUR",
                "GBP"
            ]
        },
        "Vendors": {
            "name": "Vendors",
            "values": [
                "Cubitac",
                "ForeverMark",
                "GHI",
                "US",
                "Cabinet",
                "Wolf",
                "TSG",
                "Matrix",
                "Cabinets",
                "Hornings",
                "Supply"
            ]
        },
        "Carriers": {
            "name": "Carriers",
            "values": [
                "FedEx",
                "UPS",
                "USPS"
            ]
        },
        "PayLoadType": {
            "name": "PayLoadType",
            "values": [
                "SALES",
                "PURCHASE",
                "CONFRINATION"
            ]
        }
    },
    "nonModels": {
        "Address": {
            "name": "Address",
            "fields": {
                "contact": {
                    "name": "contact",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "line1": {
                    "name": "line1",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "line2": {
                    "name": "line2",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "city": {
                    "name": "city",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "state": {
                    "name": "state",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "postalCode": {
                    "name": "postalCode",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                }
            }
        }
    },
    "codegenVersion": "3.4.4",
    "version": "e812a6b1b8224f8d31dc734142820694"
};