(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-87342479-1', 'auto');
  ga('send', 'pageview');


function fn_preguntas()
{
  $("#myModal").modal();
}

function MaxLengthLimit(input, maxLength)
{

    $(input).after('<h6 class="pull-right" id="' + $(input).attr('id') + '_limit" ng-show="validarEstado">0/' + maxLength + '</h6>');
    $(input).attr("onkeyup", "return validarLengthInput('" + input + "'," + maxLength + ")");
  $(input).attr("maxlength", maxLength);

    var max = maxLength;
    //$(input).html(max + ' caracteres');
}
function validarLengthInput(input, maxLength)
{
    //debugger;
    var length = $(input).val().length;
    var value = maxLength - length;
    value = value < 0 ? 0 : value;
    $('#'+$(input).attr('id') + '_limit').text(length + '/'+maxLength);
    if (value <= 0)
        $(input).val(ellipse($(input).val(),maxLength));
}

function ellipse(str, max) {
    return str.length >= max ? str.substring(0, max): str;
}

function fn_cancelar()
{
  location.href = "http://www.dimetutraba.pe/";
}
function fn_mensajeFinal(id_traba)
{
    var theResponse = null;
        $.ajax({
            url: 'http://www.dimetutraba.pe/content/_Agradecimiento.php',
            type: 'POST',
            data: {id_traba:id_traba},
            dataType: "html",
            async: false,
            success: function(respText){
                theResponse = respText;
            }
        });
  
    bootbox.confirm({
      message: theResponse,
      closeButton: false,
      onEscape :false,
      buttons: {
        cancel: {
          label: '<i class="fa fa-times"></i> Cancel',
          className:'hidden'
        },
        confirm: {
          label: '<i class="fa fa-check"></i> OK'
        }
      },
      callback: function (result) {
        if(result)
        location.reload();
      }
    });
}

function fn_enviarTraba()
{
  
  var dialog = bootbox.dialog({
    message: '<p><i class="fa fa-spin fa-spinner"></i> Guardando...</p>',
    closeButton: false,
    show:false
  });
  
  $.ajax({
            type: "POST",
            url: 'http://www.dimetutraba.pe/ajax2/guardar-datos-traba-ajax.php',            
            data: $("#form-traba").serialize(),
      dataType:"json",
      async:false,
            beforeSend: function () {
         $("#errors").hide();
               dialog.modal('show');
         $(".btn").attr("disabled","disabled");
            },
            complete: function () {
                dialog.modal('hide');
            },
            success: function (response) {
        $(".btn").removeAttr("disabled");
        fn_mensajeFinal(response['id_traba']);        
            },
            error: function (result) {
        
        $(".btn").removeAttr("disabled");
        
                $("#errors").html(result.responseText).hide();
                $('form').animate({ scrollTop: 0 }, '500', 'swing', function () {
                    $("#errors").slideDown(500, function () { });
                });

            },
    });
}




$(document).ready(function(e) {
    
  
   MaxLengthLimit("#comentario", 300)
  
  $("#cboEntidad").change(function(e) {
       
     var value = $(this).val();
     
     $.ajax({
      url:'http://www.dimetutraba.pe/dimetutraba/getDatosEntidad/'+$(this).val(),
      data:{ },
      type:'POST',
      dataType:"json",
      success: function(response){      
        
        $(".nivel3").slideUp(500).addClass("hidden");
        if ( response['caso'] == null || response['caso'] == "" )
          {         
          $(".entidad").removeClass("hidden").hide().slideDown(500); 
          $(".ubigeo div").addClass("hidden").hide().slideUp(500);   
          }else if ( response['caso'] == 'UBIGEO'){
          $(".ubigeo div").removeClass("hidden").hide().slideDown(500);  
          $(".entidad").addClass("hidden").hide().slideUp(500);  
            }else if ( response['caso'] == 'NINGUNO'|| value == 0 ){
          $(".ubigeo div").addClass("hidden").hide().slideUp(500);  
          $(".entidad").addClass("hidden").hide().slideUp(500);  
         }
      }
    }); 
      
     
     if (value != 0 )
     {
      $(".oficina").removeClass("hidden").hide().slideDown(500); 
     }
     else
     {
      $(".oficina").addClass("hidden").slideUp(500);   
     }

      $.ajax({
      url:'http://www.dimetutraba.pe/dimetutraba/entidad/'+$("#cboEntidad").val(),
      data:{},
      type:'POST',
      dataType:"json",
      success: function(response){                
        $("#cboEntidadDetalle").html(response['listado']);        
        //if( response['mostrarTercerNivel'] )
          //$(".nivel3").removeClass("hidden").hide().slideDown(500);  
        //else
          //$(".nivel3").slideUp(500).addClass("hidden");
      }
    }); 

    });
  


  //Start Change Entidad Nivel 2
  $("#cboEntidadDetalle").change(function(e) {    
    $.ajax({
      url:'http://www.dimetutraba.pe/dimetutraba/entidad/'+$(this).val(),
      data:{},
      type:'POST',
      dataType:"json",
      success: function(response){                
        $("#cboDetalle3").html(response['listado']);
        if( response['mostrarTercerNivel'] )
          $(".nivel3").removeClass("hidden").hide().slideDown(500);  
        else
          $(".nivel3").slideUp(500).addClass("hidden");
      }
    }); 
  });
  //End

  //ubigeo  
  $("#departamento").change(function(e) {    
    $.ajax({
      url:'http://www.dimetutraba.pe/acuicultura/provincia/'+$(this).val(),
      data:{codigo_departamento : $(this).val()},
      type:'POST',
      success: function(response){      
        $("#provincia").html(response);
        $("#provincia option[value=0]").html('SELECCIONE');
        $("#provincia").change();
      }
    }); 
  });
  
  $("#provincia").change(function(e) {
    
    $.ajax({
      url:'http://www.dimetutraba.pe/acuicultura/distrito/'+$("#departamento").val()+'/'+$(this).val(),
      data:{},
      type:'POST',
      success: function(response){        
        $("#distrito").html(response);
        $("#distrito option[value=0]").html('SELECCIONE');
      }
    }); 
  });

});
</script>