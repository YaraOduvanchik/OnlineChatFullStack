using System.Text.Json;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using OnlineChat.Models;

namespace OnlineChat.Hubs;

public interface IChatClient
{
    Task ReceiveMessage(string userName, string message);
}

public class ChatHub : Hub<IChatClient>
{
    private readonly IMemoryCache _cache;

    public ChatHub(IMemoryCache cache)
    {
        _cache = cache;
    }

    public async Task JoinChat(UserConnection connection)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, connection.ChatRoom);

        _cache.Set(Context.ConnectionId, connection);

        await Clients
            .Group(connection.ChatRoom)
            .ReceiveMessage("System", $"{connection.UserName} has joined the chat.");
    }

    public async Task SendMessage(string message)
    {
        _cache.TryGetValue(Context.ConnectionId, out UserConnection? connection);

        if (connection is null) return;

        await Clients
            .Group(connection.ChatRoom)
            .ReceiveMessage(connection.UserName, message);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        _cache.TryGetValue(Context.ConnectionId, out UserConnection? connection);

        if (connection is null)
        {
            await base.OnDisconnectedAsync(exception);
            return;
        }

        await Groups.RemoveFromGroupAsync(Context.ConnectionId, connection.ChatRoom);

        await Clients
            .Group(connection.ChatRoom)
            .ReceiveMessage("System", $"{connection.UserName} has left the chat.");

        _cache.Remove(Context.ConnectionId);

        await base.OnDisconnectedAsync(exception);
    }
}