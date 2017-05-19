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

    socket.emit("createMessage", {
        from: "User", 
        text: jQuery("[name=message]").val()
    }, function() {

    });
});

var locationButton = jQuery("#send-location"); 
locationButton.on("click", function() {
    if(!navigator.geolocation) {
        alert("Gelocation not supported by your browser");
    }

    navigator.geolocation.getCurrentPosition(function(position) {
        socket.emit("createLocationMessage", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function() {
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