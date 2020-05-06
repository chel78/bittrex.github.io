var R = require('ramda'),
    _ = require('lodash');

function spectacleTopics(json) {
    console.log('Adding Spectacle topics...');
    return _.assign({}, json, {
        'x-spectacle-topics': {
            "Pre-Release Warning": {
                "description": "> **Warning**: The v3-Beta or other pre-release API versions are not for production use.\n\n The v3-Beta release will be subject to breaking changes, potentially without notice, until the final API is released. Pre-release APIs should only be used for testing and review.\n\nThe v3-Beta API will operate against production (live-site) data and accounts and we recommend using test accounts and small-value transactions to validate your implementation.\n\nBy using the v3-Beta API you understand and agree that issues may be encountered without warning, affecting your use of the website and API. Bittrex provides no warranties, either express or implied, as to the suitability or usability of pre-release APIs. Bittrex will not be liable for any loss, whether such loss is direct, indirect, special or consequential, suffered by any party as a result of their use of the v3-Beta API or other pre-release APIs. "
            },
            "Change Log": {
               "description": "__01/27/2020__ \n\n - Conditional orders (e.g. stop loss) have been added to the V3 API Beta. See the new Placing Conditinal Orders section below for additional information.\n\n - Historical candles are now available in the API\n\n - The functionality of the existing candles endpoint has been duplicated into a candles/.../recent endpoint. The existing one will be retired in a future release. \n\nTo see all of the recent changes, please visit the [change list](https://bittrex.zendesk.com/hc/en-us/sections/200567324-Changelist)."
            },
            "Known Issues": {
                "description": "- The trigger price shown on the website for trailing stop orders does not update automatically. The see the updated trigger price, refresh the page or query the api.\n\n- A conditional order cancelled via OCO will not automatically be removed from the list of open conditional orders on the website despite being cancelled. Refreshing the page will correct the issue.\n\n- The `baseVolume` under GET /markets/summaries and GET /markets/{marketSymbol}/candles is actually the quote volume. baseVolume will be removed in a future release. Use quoteVolume instead."
            },
            "Getting Started": {
                "description": "Keep the following in mind when developing against the Bittrex API: \n - Enable 2FA on your account. API Keys cannot be generated unless 2FA is enabled and extended verification is done on the account.\n - All REST requests must be sent to `https://api.bittrex.com/v3` using the `application/json` content type. Non-HTTPS requests will be redirected to HTTPS, possibly causing functional or performance issues with your application."
            },
            "Best Practices": {
                "description": "### Call Limits\n The Bittrex API employs call limits on all endpoints to ensure the efficiency and availability of the platform for all customers. In general, API users are permitted to make a maximum of 60 API calls per minute. Calls after the limit will fail, with the limit resetting at the start of the next minute.\n\n __Note: Corporate and high-volume accounts may contact customer support for additional information to ensure that they may continue operating at an optimal level.__"
            },
            "Pagination": {
                "description": "### Overview\n Several Bittrex API resources support bulk fetches via 'list' API methods. For example, you can list deposits, list closed orders, and list withdrawals. These list API methods share a common structure, using at least these three parameters: `pageSize, nextPageToken and previousPageToken.` These parameters, if necessary are specified as query parameters on the HTTP request.\n\n ### Arguments:\n\n\n\n - __pageSize(optional)__: A limit on the number of objects to be returned between 1 and 200, defaults to 100\n - __nextPageToken(optional)__: The id of the last item on the current page. This is used for defining the starting point of the next page. For instance, if you make a list request and receive 100 objects ending with objFoo, your subsequent call can include `nextPageToken=objFoo's id` in order to fetch the next page of the list starting after objFoo.\n\n - __previousPageToken(optional)__: The id of the first item on the current page. This is used for defining the ending point of the previous page. For instance, if you make a list request and receive 100 objects starting with objBar, your subsequent call can include `previousPageToken=objBar's id` in order to fetch the previous page of the list.\n\n\n ### Examples:\n\nList withdrawals, in reverse chronological order, up to maximum of 20 withdrawals, starting at the most recent withdrawal created:\n\n`https://api.bittrex.com/v3/withdrawals?pageSize=20`\n\nList withdrawals, in reverse chronological order, up to maximum of 10 withdrawals, starting after the withdrawal with ID of `940af3c3-665d-4432-a12e-cdf8fd99ab3b`\n\n`https://api.bittrex.com/v3/withdrawals?pageSize=10&nextPageToken=940af3c3-665d-4432-a12e-cdf8fd99ab3b`\n\n List withdrawals, in reverse chronological order, up to a maximum of 10 withdrawals, ending before the withdrawal with ID of `0d990dd2-4103-4d57-8e80-047e886537db`: \n\n`https://api.bittrex.com/v3/withdrawals?pageSize=10&previousPageToken=0d990dd2-4103-4d57-8e80-047e886537db`\n\n"
            },
            "Placing Orders": {
                "description": "### __Order Types__:\n\n - __Market Order__ : • An order to buy or sell a specified quantity of an asset immediately at the best available price. The market order will consume available orders on the book as it executes. Consequently, especially for large orders, the average price at which the order is filled will deviate from the last-traded price or current quote.\n\n - __Limit Order__ : An order to trade a specified quantity of an asset at a specified price. A buy order will only be filled at or below the limit price and a sell order will only be filled at or above the limit price.\n\n - __Ceiling Order__ : A market or limit order that allows you to specify the amount of quote currency you want to spend (or receive, if selling) instead of the quantity of the market currency (e.g. buy $100 USD of BTC at the current market BTC price)\n\n - __Good-Til-Cancelled Order__ : The order remains in force until it is explicitly cancelled either by the user or by Bittrex \n\n - __Immediate-Or-Cancel Order__ : The order will be filled immediately as much as possible and then cancelled.\n\n - __Fill-or-Kill__ : The order will be filled immediately and completely, or it is cancelled without being filled at all.\n\n - __Post Only__ : This option allows market makers to ensure that their orders are making it to the order book instead of matching with a pre-existing order. Note: If the order is not a maker order, you will return an error and the order will be cancelled\n\n - __Conditional Order__ : A directive for the system to place an order on your behalf when the price on the market moves past a given threshold. These are treated separately from orders. Refer to the Placing Conditional Orders section for more information. \n\n\n ### __Order types and time in force__ : \n\n The following table shows which time in force options apply to which order types.\n\n\n<div style='overflow-x:auto;'><table><tbody><tr><th>timeInForce</th><th>LIMIT</th><th>MARKET</th><th>CEILING_LIMIT</th><th>CEILING_MARKET</th></tr><tr><td>GOOD_TIL_CANCELLED</td><td>BUY OR SELL</td><td>NOT ALLOWED</td><td>NOT ALLOWED</td><td>NOT ALLOWED</td></tr><tr><td>IMMEDIATE_OR_CANCEL</td><td>BUY OR SELL</td><td>BUY OR SELL</td><td>BUY OR SELL</td><td>BUY OR SELL</td></tr><tr><td>FILL_OR_KILL</td><td>BUY OR SELL</td><td>BUY OR SELL</td><td>BUY OR SELL</td><td>BUY OR SELL</td></tr><tr><td>POST_ONLY_GOOD_TIL_CANCELLED</td><td>BUY OR SELL</td><td>NOT ALLOWED</td><td>NOT ALLOWED</td><td>NOT ALLOWED</td></tr></tbody></table></div> \n\n\n ### __clientOrderId__: \n\nAn optional UUID which is generated by the user to to keep a track of the order. If the outcome of placing an order is not known (for example due to a client-side crash that occurred while placing the order), the same order can be safely placed again using the same UUID as the clientOrderId. If the order was received and processed the first time, the API will return an error that includes the existing order's id instead of creating a second order. This protection is in place for 24 hours after an order is placed. Although clientOrderIds which are more than 24 hours old are no longer checked against new orders, they remain associated with their orders as metadata and may be retrieved by clients.\n\n"
            },
        "Placing Conditional Orders": {
            "description": "### Placing Conditional Orders\n\nConditional orders are placed using this API by specifying the market price trigger conditions and what action to take when the trigger is reached. When a trade occurs on the market that matches the trigger conditions, the actions are triggered such as placing an order. Conditional orders are not the same as orders. They are stored separately from normal orders and do not appear on the order book. As such, there is a small delay between trading occurring on the market and corresponding conditional orders being triggered.\n\nCare must also be taken when working with conditional orders because balance is not reserved. If you create a conditional order costing an amount in excess of your account balance for a currency or if your account balance drops due to other trades subsequent to you placing a conditional order there is a risk that you will not have enough balance available to place the order when the conditional order’s condition is met. If this occurs, placement of the order will fail.\n\n#### Trigger conditions:\n\nThe trigger for a conditional order is made up of two parts: the operand and the trigger price or percentage. Operand may be either less than or equal to (LTE) or greater than or equal to (GTE). triggerPrice will be compared to the price of the last trade on the market to determine if the action(s) specified in the conditional order should be executed. Alternately, a trailingStopPercent may be specified. This will cause the triggerPrice to float a fixed percent off from the smallest or largest price seen since the conditional order was placed. The below table summarizes these options:\n\n\n<div style='overflow-x:auto;'><table><tbody><tr><th>Parameter provided</th><th>Operand</th><th>Trigger Price</th><th>Triggers when</th></tr><tr><td>triggerPrice</td><td>LTE</td><td>Constant</td><td>A trade occurs at a price LTE the provided trigger price</td></tr><tr><td>triggerPrice</td><td>GTE</td><td>Constant</td><td>A trade occurs at a price GTE the provided trigger price</td></tr><tr><td>trailingStopPercent</td><td>LTE</td><td>Calculated to be trailingStopPercent less than the maximum trade price on the market since the conditional order was placed</td><td>A trade occurs at a price LTE the calculated trigger price</td></tr><tr><td>trailingStopPercent</td><td>GTE</td><td>Calculated to be trailingStopPercent more than the minimum trade price on the market since the conditional order was placed</td><td>A trade occurs at a price GTE the calculated trigger price</td></tr></tbody></table></div> \n\n\n#### Actions:\n\nWhen the trigger condition is met, this will result in a new order being placed and, optionally, another order or conditional order being cancelled. The order to place is configured by populating orderToCreate with the same object you would post to create an order. There are some limitations: ceiling orders, post only orders, awards, and clientOrderId are not supported. For idempotency, instead specify a clientConditionalOrderId as a peer of orderToCreate in the request body.\n\nIf canceling an order is desired, provide the id of the order to cancel and the type of order (ORDER for an order on the book or CONDITIONAL_ORDER) in the orderToCancel object. This will pair the newly placed or with its target. If either conditional order triggers, the other will be cancelled. If both are trigger simultaneously, only the first conditional order place will trigger and the other will be cancelled. Note that there is not currently a way to break up two conditional orders paired in the fashion. To change the cancellation relationship, both conditional orders must be cancelled and placed again. You cannot link more than two orders in the fashion. Also note that if the orderToCancel is an order on the book and the conditional order triggers, the order on the book will be cancelled to free up funds prior to attempting to place the ordered triggered by the condition."
             },
            "Sub Accounts": {
                "description": "(NOTE: This functionality is limited to partners and unavailable to general traders.)\n\nThe subaccount feature will enable partners to create a sub accounts for each of their users allowing the users to create sub account deposit addresses, manage deposit and withdrawal transactions as well as place orders from for the sub and access historical data.\n\n\n ### Getting Started: \n\n Key points to remember before working with this feature :\n\n - Enable 2FA on your account as the API Keys cannot be generated unless 2FA is enabled and extended verification is done on the account.\n\n - When enabled, authentication mechanism will need to be modified which is shown under `Api-subaccount-ID` under Authentication with with examples."
            },
            "Error Codes": {
                "description": "### __Overview__:\n\n If an error occurs during the processing of an API request, the Bittrex API will return an error to the caller. The general flow of information to check is:\n\n - status code of the response.\n\n - error code and other information in the response body (JSON)\n\n### __HTTP Status Codes__\n\n<div style='overflow-x:auto;'><table><tbody><tr><th>Status Code</th><th>Description</th></tr><tr><td>400 - Bad Request</td><td>The request was malformed, often due to a missing or invalid parameter. See the error code and response data for more details.</td></tr><tr><td>401 - Unauthorized</td><td>The request failed to authenticate (example: a valid api key was not included in your request header)</td></tr><tr><td>403 - Forbidden</td><td> The provided api key is not authorized to perform the requested operation (example: attempting to trade with an api key not authorized to make trades)</td></tr><tr><td>404 - Not Found</td><td>The requested resource does not exist.</td></tr><tr><td>409 - Conflict</td><td>The request parameters were valid but the request failed due to an operational error. (example: INSUFFICIENT_FUNDS) </td><tr><td>429 - Too Many Requests</td><td>Too many requests hit the API too quickly. Please make sure to implement exponential backoff with your requests.</td></tr><tr><td>501 - Not Implemented</td><td>The service requested has not yet been implemented.</td></tr><tr><td>503 - Service Unavailable</td><td>The request parameters were valid but the request failed because the resource is temporarily unavailable (example: CURRENCY_OFFLINE)</td></tr></tbody></table></div>\n\n"
            }
        }
    });
}


function siteDescription(json) {
    console.log('Adding site description...');
    return _.assign({}, json, {
        "info": {
            "version": "v3",
            "title": "Bittrex API",
            "description": "Bittrex provides a simple and powerful API consisting of REST endpoints for transactional operations .\n\n Access to and use of the API is governed by our Terms of Service.\n If you are a user of Bittrex.com, the applicable Terms of Service are available [here](https://bittrex.com/home/terms).\n If you are a user of Bittrex Global, the applicable Terms of Service are available [here](https://global.bittrex.com/home/terms).\n\n If you have any API questions, feedback, or recommendations please post a question via our [Github page](https://github.com/Bittrex/bittrex.github.io/issues)."
        }
    });
}

function securityDefinitions(json) {
    console.log('Adding security definition section...');
    return _.assign({}, json, {
        "securityDefinitions": {
            "api_key": {
                "description": "### Overview\n In order to properly sign an authenticated request for the Bittrex v3 API, the following headers must be included:\n\n- `Api-Key`\n\n- `Api-Timestamp`\n\n- `Api-Content-Hash`\n\n- `Api-Signature`\n\n- `Api-Subaccount-Id (optional)`\n\n\nThe following sections are instructions for properly populating these headers.\n\n---\n #### Api-Key\nPopulate this header with your API key.\n\nExample Value:\n\n`4894xxxxxxxx407e827d05xxxxxxxxxx`\n\n---\n #### Api-Timestamp\nPopulate this header with the current time as a UNIX timestamp, in epoch-millisecond format.\n\nSample JS Code Snippet:\n\n``` javascript\nvar timestamp = new Date().getTime();\n```\n\nExample Value:\n\n`1542323450016`\n\n---\n #### Api-Content-Hash\nPopulate this header with a SHA512 hash of the request contents, Hex-encoded. If there are no request contents, populate this header with a SHA512 hash of an empty string.\n\nSample JS Code Snippet:\n\n``` javascript\nvar contentHash = CryptoJS.SHA512(content).toString(CryptoJS.enc.Hex);\n```\n\nExample Value:\n\n``` markdown\ncf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e\n```\n\n---\n #### Api-Subaccount-Id (Only for subaccount feature) \n(NOTE: This functionality is limited to partners and unavailable to general traders.)\n\nIf you wish to make a request on behalf of a subaccount, you will need to:\n\n1. Authenticate using all 4 of the headers above referring to your master account.\n2. Populate the Api-Subaccount-Id header with the UUID of the subaccount you wish to impersonate for this request. The specified subaccount *must* be a subaccount of the master account used to authenticate the request.\n3. Include the Api-Subaccount-Id header at the end of the pre-signed signature, as indicated in the next section.\n\nExample Value:\n\n`x111x11x-8968-48ac-b956-x1x11x111111`\n\n---\n #### Api-Signature\nCreate a pre-sign string formed from the following items and concatenating them together:\n1. Contents of your `Api-Timestamp` header\n2. The full URI you are using to make the request (including query string)\n3. The HTTP method of the request, in all caps (GET, POST, DELETE, etc.)  \n4. Contents of your `Api-Content-Hash` header \n5. Content of your `Api-Subaccount-Id` header (or an empty string if not present) \n\n\nOnce you have created this pre-sign string, sign it via HmacSHA512, using your API secret as the signing secret. Hex-encode the result of this operation and populate the `Api-Signature` header with it.\n\n\nSample JS Code Snippet:\n\n``` javascript\nvar uri = 'https://api.bittrex.com/v3/balances';\nvar preSign = [timestamp, uri, method, contentHash, subaccountId].join('');\nvar signature = CryptoJS.HmacSHA512(preSign, apiSecret).toString(CryptoJS.enc.Hex);\n```\n\nExample Pre-Signed Value (no subaccount)\n\n``` markdown\n1542323450016https://api.bittrex.com/v3/balancesGETcf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e\n```\n\nExample Pre-Signed Value (with subaccount)\n\n``` markdown\n1542323450016https://api.bittrex.com/v3/balancesGETcf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3ex111x11x-8968-48ac-b956-x1x11x111111\n```\n\nExample Post-Signed Value:\n\n``` markdown\n939047623f0efbe10bfbb32f18e5d8885b2a91be3c3cea82adf0dd2d20892b20bcb6a10a91fec3afcedcc009f2b2a86c5366974cfadcf671fe0490582568f51f\n```\n\n\n"
            }
        }
    });
}

function requestExamples(json) {
    console.log('Adding request URL examples...');
    return _.merge({}, json, {
        "paths": {
            "/account": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/account"
                }
            },
            "/addresses": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/addresses"
                },
                "post": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/addresses"
                }
            },
            "/addresses/{currencySymbol}": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/addresses/{currencySymbol}"
                }
            },
            "/balances": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/balances"
                }
            },
            "/balances/{currencySymbol}": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/balances/{currencySymbol}"
                }
            },
            "/currencies": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/currencies"
                }
            },
            "/currencies/{symbol}": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/currencies/{symbol}"
                }
            },
            "/deposits/closed": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/deposits/closed"
                }
            },
            "/deposits/open": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/deposits/open"
                }
            },
            "/deposits/ByTxId/{txId}": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/deposits/ByTxId/{txId}"
                }
            },
            "/deposits/{depositId}": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/deposits/{depositId}"
                }
            },
            "/markets": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/markets"
                }
            },
            "/markets/summaries": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/markets/summaries"
                }
            },
            "/markets/{marketSymbol}": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/markets/{marketSymbol}"
                }
            },
            "/markets/{marketSymbol}/summary": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/markets/{marketSymbol}/summary"
                }
            },
            "/markets/{marketSymbol}/orderbook": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/markets/{marketSymbol}/orderbook"
                }
            },
            "/markets/{marketSymbol}/trades": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/markets/{marketSymbol}/trades"
                }
            },
            "/markets/tickers": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/markets/tickers"
                }
            },
            "/markets/{marketSymbol}/ticker": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/markets/{marketSymbol}/ticker"
                }
            },
            "/markets/{marketSymbol}/candles": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/markets/{marketSymbol}/candles"
                }
            },
            "/orders/closed": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/orders/closed"
                }
            },
            "/orders": {
                "post": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/orders"
                }
            },
            "/orders/open": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/orders/open"
                }
            },
            "/orders/{orderId}": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/orders/{orderId}"
                },
                "delete": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/orders/{orderId}"
                }
            },
            "/subaccounts": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/subaccounts"
                },
                "post": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/subaccounts"
                }
            },
            "/subaccounts/{subaccountId}": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/subaccounts/{subaccountId}"
                }
            },
            "/transfers/sent": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/transfers/sent"
                }
            },
            "/transfers/received": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/transfers/received"
                }
            },
            "/transfers/{transferId}": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/transfers/{transferId}"
                }
            },
            "/transfers": {
                "post": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/transfers"
                }
            },
            "/ping": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/ping"
                }
            },
            "/withdrawals": {
                "post": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/withdrawals"
                }
            },
            "/withdrawals/open": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/withdrawals/open"
                }
            },
            "/withdrawals/closed": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/withdrawals/closed"
                }
            },
            "/withdrawals/ByTxId/{txId}": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/withdrawals/ByTxId/{txId}"
                }
            },
            "/withdrawals/{withdrawalId}": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/withdrawals/{withdrawalId}"
                },
                "delete": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/withdrawals/{withdrawalId}"
                }
            }
        }
    });
}

// removes the Uuid examples from specified definitions
function removeUuidExamples(json) {
    console.log('Removing examples from uuid-formatted properties in "definitions"...');
    var definitions = json['definitions'];
    return _.assign({}, json, {
        definitions: _.mapValues(definitions, function (definition, defKey) {
            var properties = definition['properties'];
            return _.assign(definition, {
                properties: _.mapValues(properties, function (property, propKey) {
                    var format = property['format'],
                        example = property['example'];
                    if (format && format === 'uuid' && example) {
                        console.log('Removing example', example, 'from', defKey + '.' + propKey);
                        return _.omit(property, 'example');
                    } else {
                        return property;
                    }
                })
            });
        })
    });
}


function transformPathParameters(json) {
    console.log('Transforming Path Parameters');
    var paths = json['paths'];

    var transformUuidParameter = function (param) {
        return _.assign({}, param, {
            description: '_(uuid-formatted string)_ - ' + param.description
        });
    }

    var transformParameters = function (parameters) {
        if (!parameters) return;
        return _.map(parameters, function(parameter, index, arr) {
            if (parameter['format'] === 'uuid') {
                return transformUuidParameter(parameter);
            } else {
                return parameter;
            }
        });
    };

    var transformOperation = function (operation, opKey) {
        return _.assign({}, operation, {
            parameters: transformParameters(operation['parameters'])
        });
    };

    var transformPaths = function (path, pathKey) {
        var transformed = _.mapValues(path, transformOperation);
        return _.assign({}, path, transformed);
    };

    return _.assign({}, json, {
        paths: _.mapValues(paths, transformPaths)
    });
}


module.exports = R.pipe(
    spectacleTopics,
    siteDescription,
    securityDefinitions,
    requestExamples,
    removeUuidExamples,
    transformPathParameters
);