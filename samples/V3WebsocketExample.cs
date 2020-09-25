/*   
 * Last tested 2020/09/24 on .Net Core 3.1
 *  
 * Note: This file is intended solely for testing purposes and may only be used 
 *   as an example to debug and compare with your code. The 3rd party libraries 
 *   used in this example may not be suitable for your production use cases.
 *   You should always independently verify the security and suitability of any 
 *   3rd party library used in your code.
 *   
 */

namespace V3WebsocketExample
{
    using Microsoft.AspNet.SignalR.Client;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Converters;
    using Newtonsoft.Json.Serialization;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.IO.Compression;
    using System.Security.Cryptography;
    using System.Text;
    using System.Threading.Tasks;

    class Program
    {
        const string URL = "https://socket-v3.bittrex.com/signalr";
        const string API_KEY = "";
        const string API_SECRET = "";

        static async Task Main(string[] args)
        {
            var client = new SocketClient(URL);
            if (await client.Connect())
            {
                Console.WriteLine("Connected");
            }
            else
            {
                Console.WriteLine("Failed to connect");
                return;
            }

            if (!string.IsNullOrWhiteSpace(API_SECRET))
            {
                await Authenticate(client, API_KEY, API_SECRET);
                client.SetAuthExpiringHandler(async () =>
                {
                    Console.WriteLine("Authentication expiring...");
                    await Authenticate(client, API_KEY, API_SECRET);
                });
            }
            else
            {
                Console.WriteLine("Authentication skipped because API key was not provided");
            }
            await Subscribe(client);
            Console.ReadKey();
        }

        static async Task Authenticate(SocketClient client, string apiKey, string apiSecret)
        {
            var result = await client.Authenticate(apiKey, apiSecret);
            if (result.Success)
            {
                Console.WriteLine("Authenticated");
            }
            else
            {
                Console.WriteLine($"Authentication failed: {result.ErrorCode}");
            }
        }

        static async Task Subscribe(SocketClient client)
        {
            client.SetHeartbeatHandler(() => Console.WriteLine("<heartbeat>"));
            client.AddMessageHandler<object>("trade", msg => Console.WriteLine($"Trade: {msg}"));
            client.AddMessageHandler<object>("balance", msg => Console.WriteLine($"Balance: {msg}"));

            var channels = new string[] {
                "heartbeat",
                "trade_BTC-USD",
                "balance" };
            var response = await client.Subscribe(channels);
            for (int i = 0; i < channels.Length; i++)
            {
                Console.WriteLine(response[i].Success ? $"{channels[i]}: Success" : $"{channels[i]}: {response[i].ErrorCode}");
            }
        }
    }

    public class SocketResponse
    {
        public bool Success { get; set; }
        public string ErrorCode { get; set; }
    }

    public class SocketClient
    {
        private string _url;
        private HubConnection _hubConnection;
        private IHubProxy _hubProxy;


        public SocketClient(string url)
        {
            _url = url;
            _hubConnection = new HubConnection(_url);
            _hubProxy = _hubConnection.CreateHubProxy("c3");
        }

        public async Task<bool> Connect()
        {
            await _hubConnection.Start();
            return _hubConnection.State == ConnectionState.Connected;
        }

        public async Task<SocketResponse> Authenticate(string apiKey, string apiKeySecret)
        {
            var timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            var randomContent = $"{ Guid.NewGuid() }";
            var content = string.Join("", timestamp, randomContent);
            var signedContent = CreateSignature(apiKeySecret, content);
            var result = await _hubProxy.Invoke<SocketResponse>(
                "Authenticate",
                apiKey,
                timestamp,
                randomContent,
                signedContent);
            return result;
        }

        public IDisposable AddMessageHandler<Tmessage>(string messageName, Action<Tmessage> handler)
        {
            return _hubProxy.On(messageName, message =>
            {
                var decoded = DataConverter.Decode<Tmessage>(message);
                handler(decoded);
            });
        }

        public void SetHeartbeatHandler(Action handler)
        {
            _hubProxy.On("heartbeat", handler);
        }

        public void SetAuthExpiringHandler(Action handler)
        {
            _hubProxy.On("authenticationExpiring", handler);
        }

        private static string CreateSignature(string apiSecret, string data)
        {
            var hmacSha512 = new HMACSHA512(Encoding.ASCII.GetBytes(apiSecret));
            var hash = hmacSha512.ComputeHash(Encoding.ASCII.GetBytes(data));
            return BitConverter.ToString(hash).Replace("-", string.Empty);
        }

        public async Task<List<SocketResponse>> Subscribe(string[] channels)
        {
            return await _hubProxy.Invoke<List<SocketResponse>>("Subscribe", (object)channels);
        }
    }

    public static class DataConverter
    {
        private static JsonSerializerSettings _jsonSerializerSettings = new JsonSerializerSettings
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver(),
            DateFormatHandling = DateFormatHandling.IsoDateFormat,
            DateTimeZoneHandling = DateTimeZoneHandling.Utc,
            FloatParseHandling = FloatParseHandling.Decimal,
            MissingMemberHandling = MissingMemberHandling.Ignore,
            NullValueHandling = NullValueHandling.Ignore,
            Converters = new List<JsonConverter>
            {
                new StringEnumConverter(),
            }
        };

        public static T Decode<T>(string wireData)
        {
            // Step 1: Base64 decode the wire data into a gzip blob
            byte[] gzipData = Convert.FromBase64String(wireData);

            // Step 2: Decompress gzip blob into JSON
            string json = null;

            using (var decompressedStream = new MemoryStream())
            using (var compressedStream = new MemoryStream(gzipData))
            using (var deflateStream = new DeflateStream(compressedStream, CompressionMode.Decompress))
            {
                deflateStream.CopyTo(decompressedStream);
                decompressedStream.Position = 0;
                using (var streamReader = new StreamReader(decompressedStream))
                {
                    json = streamReader.ReadToEnd();
                }
            }

            // Step 3: Deserialize the JSON string into a strongly-typed object
            return JsonConvert.DeserializeObject<T>(json, _jsonSerializerSettings);
        }
    }
}
