var socket = io();

socket.on("connect", function() {
    console.log("Connected to server");
});

socket.on("newMessage", function(msg) {
    console.log("New Message", msg);
    var li = jQuery("<li></li>");
    li.text(`${msg.from}: ${msg.text}`);

    jQuery("#messagesList").append(li);
});

socket.on("disconnect", function() {
    console.log("Disconnected from server");
});

jQuery("#message-form").on("submit", function(e) {
    e.preventDefault();

    var messageTextBox = jQuery("[name = message]");

    socket.emit("createMessage", {
        from: "User", 
        text: messageTextBox.val()
    }, function() {
        messageTextBox.val("");
    });
});

var locationButton = jQuery("#send-location"); 
locationButton.on("click", function() {
    if(!navigator.geolocation) {
        return alert("Gelocation not supported by your browser");
    }

    locationButton.attr("disabled", "disabled").text("Sending location...");

    navigator.geolocation.getCurrentPosition(function(position) {
        locationButton.removeAttr("disabled").text("Send location");
        socket.emit("createLocationMessage", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function() {
        locationButton.removeAttr("disabled").text("Send location");
        alert("Unable to fetch location");
    });
});

socket.on("newLocationMessage", function(locationMessage) {
    var li = jQuery("<li></li>");
    var a = jQuery("<a target='_blank'>My current location</a>");

    li.text(`${locationMessage.from}: `);
    a.attr("href", locationMessage.url);
    li.append(a);
    jQuery("#messagesList").append(li);
});