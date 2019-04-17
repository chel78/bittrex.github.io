var R = require('ramda'),
    _ = require('lodash');

function spectacleTopics(json) {
    console.log('Adding Spectacle topics...');
    return _.assign({}, json, {
        'x-spectacle-topics': {
            "Availability": {
                "description": "The V3-Beta API is available on an invite-only basis at this time. Later releases will be made publicly available to the community."
            },
            "Pre-Release Warning": {
                "description": "> **Warning**: The V3-Beta or other pre-release API versions are not for production use.\n\n The V3-Beta release will be subject to breaking changes, potentially without notice, until the final API is released. Pre-release APIs should only be used for testing and review.\n\nThe V3-Beta API will operate against production (live-site) data and accounts and we recommend using test accounts and small-value transactions to validate your implementation.\n\nBy using the V3-Beta API you understand and agree that issues may be encountered without warning, affecting your use of the website and API. Bittrex provides no warranties, either express or implied, as to the suitability or usability of pre-release APIs. Bittrex will not be liable for any loss, whether such loss is direct, indirect, special or consequential, suffered by any party as a result of their use of the V3-Beta API or other pre-release APIs. "
            },
            "Getting Started": {
                "description": "Keep the following in mind when developing against the Bittrex API: \n - Enable 2FA on your account. API Keys cannot be generated unless 2FA is enabled and extended verification is done on the account.\n - All REST requests must be sent to `https://api.bittrex.com/v3` using the `application/json` content type. Non-HTTPS requests will be redirected to HTTPS, possibly causing functional or performance issues with your application."
            },
            "Best Practices": {
                "description": "### Call Limits\n The Bittrex API employs call limits on all endpoints to ensure the efficiency and availability of the platform for all customers. In general, API users are permitted to make a maximum of 60 API calls per minute. Calls after the limit will fail, with the limit resetting at the start of the next minute.\n\n __Note: Corporate and high-volume accounts may contact customer support for additional information to ensure that they may continue operating at an optimal level.__"
            },
            "Pagination": {
                "description": "### Overview\n Several Bittrex API resources support bulk fetches via 'list' API methods. For example, you can list deposits, list closed orders, and list withdrawals. These list API methods share a common structure, using at least these three parameters: `pageSize, nextPageToken and previousPageToken.` These parameters, if necessary are specified as query parameters on the HTTP request.\n\n ### Arguments:\n\n\n\n - __pageSize(optional)__: A limit on the number of objects to be returned between 1 and 200, defaults to 100\n - __nextPageToken(optional)__: It is a cursor for for using pagination and acts is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects ending with objFoo, your subsequent call can include `nextPageToken=objFoo` in order to fetch the next page of the list. Typically used for paginating in the forward direction.\n\n - __previousPageToken(optional)__: It is a cursor for for using pagination and acts is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects starting with objBar, your subsequent call can include `previousPageToken=objBar` in order to fetch the previous page of the list. Typically used for paginating in the reverse direction.\n\n\n ### Examples:\n\nList withdrawals, in reverse chronological order, up to maximum of 20 withdrawals, starting at the most recent withdrawal created:\n\n`https://api.bittrex.com/v3/withdrawals?pageSize=20`\n\nList withdrawals, in reverse chronological order, up to maximum of 10 withdrawals, starting after the withdrawal with ID of `940af3c3-665d-4432-a12e-cdf8fd99ab3b`\n\n`https://api.bittrex.com/v3/withdrawals?pageSize=10&nextPageToken=940af3c3-665d-4432-a12e-cdf8fd99ab3b`\n\n List withdrawals, in reverse chronological order, up to a maximum of 10 withdrawals, ending before the withdrawal with ID of `0d990dd2-4103-4d57-8e80-047e886537db`: \n\n`https://api.bittrex.com/v3/withdrawals?pageSize=10&previousPageToken=0d990dd2-4103-4d57-8e80-047e886537db`\n\n"
            },
            "Placing Orders": {
                "description": "### __Order Types__:\n\n - __Market Order__ :An order to buy or sell an asset immediately at the best available price. The price at which a market order will execute often deviates from the last-traded price or “real time” quote.\n\n - __Limit Order__ :An order to trade a specified quantity of an asset at a specified rate or better.A buy order will only be filled at or below the limit price and a sell order will only be filled at or above the limit price.\n\n - __Ceiling Order__ : It is a type of market order which executes orders to buy/sell a specified total value of the order at the best, currently available price (e.g. buy $100 USD of BTC at the current market BTC price)\n\n - __Good-Til-Cancelled Order__ : A Good-Til-Cancelled (GTC) order is an order to buy or sell a token that lasts until the order is completed, expired, or cancelled.The maximum lifetime of any order is 28 days. Any order older then 28 days will be automatically canceled by the system and all reserved funds will be returned to your account.\n\n - __Immediate-Or-Cancel Order__ : An Immediate-Or-Cancel (IOC) order is an order to buy or sell a token that must be executed immediately. Any portion of an IOC order that cannot be filled immediately will be cancelled.\n\n - __Fill-or-Kill__ : This option allows orders to be placed which will be filled immediately and completely, or not at all.\n\n - __Post Only__ : This option allows market makers to ensure that their orders are making it to the order book instead of matching with a pre-existing order. Note: If the order is not a maker order, you will return an error and the order will be cancelled \n\n\n ### __Order types and time in force__ : \n\n The following table shows which time in force options apply to which order types.\n\n\n<div style='overflow-x:auto;'><table><tbody><tr><th>timeInForce</th><th>LIMIT</th><th>MARKET</th><th>CEILING_LIMIT</th><th>CEILING_MARKET</th></tr><tr><td>GOOD_TIL_CANCELLED</td><td>BUY OR SELL</td><td>NOT ALLOWED</td><td>NOT ALLOWED</td><td>NOT ALLOWED</td></tr><tr><td>IMMEDIATE_OR_CANCEL</td><td>BUY OR SELL</td><td>BUY OR SELL</td><td>BUY ONLY</td><td>BUY ONLY</td></tr><tr><td>FILL_OR_KILL</td><td>BUY OR SELL</td><td>BUY OR SELL</td><td>BUY ONLY</td><td>BUY ONLY</td></tr><tr><td>POST_ONLY_GOOD_TIL_CANCELLED</td><td>BUY OR SELL</td><td>NOT ALLOWED</td><td>NOT ALLOWED</td><td>NOT ALLOWED</td></tr></tbody></table></div>"
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
            "description": "Bittrex provides a simple and powerful API consisting of REST endpoints for transactional operations and a complementary Websocket service providing streaming market, order, and balance updates.\n\n Access to and use of the API is governed by our Terms of Service.\n If you are a user of Bittrex.com, the applicable Terms of Service are available [here](https://support.bittrex.com/hc/en-us/articles/360000560871).\n If you are a user of Bittrex International, the applicable Terms of Service are available [here](https://support.bittrex.com/hc/en-us/articles/360001411486).\n\n If you have any API questions, feedback, or recommendations please post a question via our [support center](https://support.bittrex.com)."
        }
    });
}

function securityDefinitions(json) {
    console.log('Adding security definition section...');
    return _.assign({}, json, {
        "securityDefinitions": {
            "api_key": {
                "description": "### Overview\n In order to properly sign an authenticated request for the Bittrex v3 API, the following headers must be included:\n\n- `Api-Key`\n\n- `Api-Timestamp`\n\n- `Api-Content-Hash`\n\n- `Api-Signature`\n\n- `Api-Subaccount-Id (optional)`\n\n\nThe following sections are instructions for properly populating these headers.\n\n---\n #### Api-Key\nPopulate this header with your API key.\n\nExample Value:\n\n`4894xxxxxxxx407e827d05xxxxxxxxxx`\n\n---\n #### Api-Timestamp\nPopulate this header with the current time as a UNIX timestamp, in epoch-millisecond format.\n\nSample JS Code Snippet:\n\n``` javascript\nvar timestamp = new Date().getTime();\n```\n\nExample Value:\n\n`1542323450016`\n\n---\n #### Api-Content-Hash\nPopulate this header with a SHA512 hash of the request contents, Hex-encoded. If there are no request contents, populate this header with a SHA512 hash of an empty string.\n\nSample JS Code Snippet:\n\n``` javascript\nvar contentHash = CryptoJS.SHA512(content).toString(CryptoJS.enc.Hex);\n```\n\nExample Value:\n\n``` markdown\ncf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e\n```\n\n---\n #### Api-Subaccount-Id (Only for subaccount feature) \n(NOTE: This functionality is limited to partners and unavailable to general traders.)\n\nIf you wish to make a request on behalf of a subaccount, you will need to:\n\n1. Authenticate using all 4 of the headers above referring to your master account.\n2. Populate the Api-Subaccount-Id header with the Guid of the subaccount you wish to impersonate for this request. The specified subaccount *must* be a subaccount of the master account used to authenticate the request.\n3. Include the Api-Subaccount-Id header at the end of the pre-signed signature, as indicated in the next section.\n\nExample Value:\n\n`x111x11x-8968-48ac-b956-x1x11x111111`\n\n---\n #### Api-Signature\nCreate a pre-sign string formed from the following items and concatenating them together:\n1. Contents of your `Api-Timestamp` header\n2. The full URI you are using to make the request (including query string)\n3. The HTTP method of the request, in all caps (GET, POST, DELETE, etc.)  \n4. Contents of your `Api-Content-Hash` header \n5. Content of your `Api-Subaccount-Id` header (or an empty string if not present) \n\n\nOnce you have created this pre-sign string, sign it via HmacSHA512, using your API secret as the signing secret. Hex-encode the result of this operation and populate the `Api-Signature` header with it.\n\n\nSample JS Code Snippet:\n\n``` javascript\nvar uri = 'https://api.bittrex.com/v3/balances';\nvar preSign = [timestamp, uri, method, contentHash, subaccountId].join('');\nvar signature = CryptoJS.HmacSHA512(preSign, apiSecret).toString(CryptoJS.enc.Hex);\n```\n\nExample Pre-Signed Value (no subaccount)\n\n``` markdown\n1542323450016https://api.bittrex.com/v3/balancesGETcf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e\n```\n\nExample Pre-Signed Value (with subaccount)\n\n``` markdown\n1542323450016https://api.bittrex.com/v3/balancesGETcf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3ex111x11x-8968-48ac-b956-x1x11x111111\n```\n\nExample Post-Signed Value:\n\n``` markdown\n939047623f0efbe10bfbb32f18e5d8885b2a91be3c3cea82adf0dd2d20892b20bcb6a10a91fec3afcedcc009f2b2a86c5366974cfadcf671fe0490582568f51f\n```\n\n\n"
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
            description: '_(guid-formatted string)_ - ' + param.description
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