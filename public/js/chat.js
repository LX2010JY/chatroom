window.onload = function () {
    var socket = io.connect();
    socket.on('connect',function () {
        socket.emit('join',prompt('what is your nickname?'));
        socket.on('announcement',function (msg) {
            $("#messages").append("<li style='color:green;'>"+msg+"</li>");
        });
    });
    //回车事件
    document.onkeydown = function(e){
        var ev = document.all ? window.event : e;
        if(ev.keyCode==13) {
            $("#send").click();
        }
    };
    socket.on('text',addMessage);
    $("#send").click(function () {
        var value = $('#mes').val();
        if(!value) return;
        addMessage('我',value);
        socket.emit('text',value);
        $('#mes').val('');
        $("#mes").focus();
        return false;
    });
    function addMessage(from,text) {
        $("#messages").append("<li><b>"+from+"</b>: "+text+"</li>");
    }

}