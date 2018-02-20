$(function(){
  var DB = {
    mantenimiento : {
      bulkUploadTxt : {
        keyFileNames:[],
        catalogoAdd:{
          cts:'Estructura de Cuentas',
          crs:'Estructura de Centros',
          div:'Estructura de Divisiones',
          mon:'Estructura de Monedas',
          tip:'Estructura de tipos',
          hmlgdsCtas:'Homologados de Cuentas',
          hmlgdsCrs:'Homologados de Centros',
          efnCts:'Minimo Nivel de Cuentas',
          uVCrs:'Unidad Virtual de Centros',
          defCts:'Reglas definidor Cuentas',
          defCrs:'Reglas definidor Centros'
        },
        table:{
          archivo1:{
            section : 'cts',
            type: 'txt',
            splitedBy:'tab',
            format:'keyValue',
            cols:'3',
            crearEdo:'NO',
            estado:'test1'
          },
          archivo2:{
            section : 'defCts',
            type: 'txt',
            splitedBy:'tab',
            format:'N/A',
            cols:'N/A',
            crearEdo:'SI',
            estado:'test2'
          },
          archivo3:{
            section : 'cts',
            type: 'txt',
            splitedBy:'arroba',
            format:'horizontal',
            cols:'N/A',
            crearEdo:'NO',
            estado:'test3'
          },
          archivo4:{
            section : 'crs',
            type: 'txt',
            splitedBy:'arroba',
            format:'horizontal',
            cols:'N/A',
            crearEdo:'SI',
            estado:'test4'
          }
        }
      }
    }
  };
console.log(DB);

/* contruye la tabla */
  function buildMntoBulkUploadDirectoryTable(){
    let tableData = DB.mantenimiento.bulkUploadTxt.table;
    delete tableData[''];
    let selctSctn = DB.mantenimiento.bulkUploadTxt.catalogoAdd;
    let output = [],option=[],i;
    let id = 1;
    for(i in tableData){
      let cnt = id++;
      let data = tableData[i];
      DB.mantenimiento.bulkUploadTxt.keyFileNames.push(i);
      var section = DB.mantenimiento.bulkUploadTxt.catalogoAdd[data.section];
      var type    = (data.type=='txt')?'Text/Plain':'CSV';
      var splitBy = (data.splitedBy=='tab')?'TAB':(data.splitedBy=='pipe')?'|':(data.splitedBy=='arroba')?'@':(data.splitedBy=='dash')?'-':(data.splitedBy=='underscore')?'_':(data.splitedBy=='comma')?',':';';
      var format  = (data.format=='keyValue')?'Padre-Hijo-Desc.':(data.format=='N/A')?'N/A':'Horizontal';
      var creaEdo = data.crearEdo;
      var EdoName = data.estado;
      var mnto    = '<div class="btn-group btn-group-xs" role="group" aria-label="edit register"> <button type="button" class="edit_Reg2BulkUploadTxt btn btn-default" rel="edit_'+i+'"><span class="glyphicon glyphicon-pencil"></span></button> <button type="button" id="delete_Reg2BulkUploadTxt" class="btn btn-default" rel="delete_'+i+'" data-toggle="confirmation" data-singleton="true" data-placement="left" data-title="¿Seguro?"><span class="glyphicon glyphicon-trash"></span></button> </div>';
      output.push('<tr id="'+i+'"><td>'+cnt+'</td><td>'+i+'</td><td>'+section+'</td><td>'+type+'</td><td>'+splitBy+'</td><td>'+format+'</td><td>'+data.cols+'</td><td>'+creaEdo+'</td><td>'+EdoName+'</td><td>'+mnto+'</td></tr>');
    }
    $('#bulkUploadTxtTBody').html('').html(output.join(''));
    for(i in selctSctn){
      let opt = selctSctn[i];
      option.push('<option value="'+i+'">'+opt+'</option>');
    }
    $('#selectFileSection').html('').append('<option value="null" selected disabled>¿a dónde va a cargar el archivo?</option>'+option.join(''));
    $('button').on('click',function(){
      let btn,rel,btnRel={rel:''};
      btn = $(this);
      rel = btn.attr('rel');
      if(rel){
        let toMatch = $(this).attr('rel').split('_')[0];
        btnRel.rel = $(this).attr('rel').split('_')[1];
        if(toMatch=='delete'||toMatch=='edit'){
          $('[data-toggle=confirmation]').confirmation({
            rootSelector: '[data-toggle=confirmation]',
            btnOkLabel:'SI',
            onConfirm: function(){
              delete dell;
              dell = $(this).attr('rel').split('_')[1];
              let tableData = DB.mantenimiento.bulkUploadTxt.table;
              delete tableData[dell];
              $('#bulkUploadTxtTBody #'+dell).remove();
            }
          });
          if(toMatch=='edit'){
            let o2e     = DB.mantenimiento.bulkUploadTxt.table[btnRel.rel];
            let section = (o2e['section'])? DB.mantenimiento.bulkUploadTxt.catalogoAdd[o2e['section']]:'';
            let edo     = (o2e.estado !='N/A')?$('#AddJk2bulkUploadTxt').show():'NO SE MUESTRA ESTADO.';
            console.log(edo);
            openModal('#'+toMatch+'_modal');
            $('#edit_FileName').val('').val(btnRel.rel);
            $('#edit_FileSection').html('').append('<option value="'+o2e['section']+'" selected disabled>'+section+'</option>'+option.join(''));
          }
        }
      }
      return;
    });

  }
  buildMntoBulkUploadDirectoryTable();
/* contruye la tabla */
  $('ul.nav li').on('click',function(){
    $('ul.nav li').removeClass('active');
    $(this).addClass('active');
  });
  $('a').on('click',function(){
    let a = $(this);
    $('article').hide();
    if(a.attr('href')){
      let rel = a.attr('rel');
      $('article#'+rel).show();
    }
  });
    $('button').on('click',function(){
      let btn = $(this);
      let rel = btn.attr('rel');
    $('#list').html('');
    if(undefined!=rel){
      if(rel != 'saveReg2blkUpld'){
        $('#addNewFileFormat')[0].reset();
        $('.saveRegister4bulkUpload').prop('disabled', true);
        openModal('#'+rel+'_modal');
      }else{
        console.log('save register to bulk upload...');
        let firstKey = '';
        let obj      = {};
        $('#addNewFileFormat').find('.form-control').each(function (i, el){
          let key = $(this).attr('id');
          let val = $(this).val();
          if(undefined == obj[key]){
            obj[key] = '';
          }
          obj[key] = val;
        });
        delete obj[undefined];
        var tblReg = DB.mantenimiento.bulkUploadTxt.table;
        if(undefined == tblReg[obj.inputFileName]){
          tblReg[obj.inputFileName] = {}
        }
        tblReg[obj.inputFileName] = {
          cols     :obj.cols,
          format   :obj.format,
          section  :obj.selectFileSection,
          splitedBy:obj.splytedBy,
          type     :obj.type,
          estado   :obj.inputJkName,
          crearEdo :obj.chk2mkJk
        }
        /*  #######################  */
        /*  aquí guardar a firebase  */
        /*  #######################  */
        buildMntoBulkUploadDirectoryTable();
      }
    }
  });
  $('#inputFileName').focusout(function(){
    let name = ($(this).val().trim())?$(this).val().trim():null;
    checkNameStatus(name);
  });
  $('.modal-footer').mouseenter(function(){
    let name = ($('#inputFileName').val().trim())?$('#inputFileName').val().trim():null;
    let nmJk = ($('#inputFileName').val().trim())?$('#inputFileName').val().trim():null;
    checkNameStatus(name);
  });
  function checkNameStatus(name){
    if (null != name && DB.mantenimiento.bulkUploadTxt.keyFileNames.indexOf(name) === -1) {
      // console.log('element doesn´t exist');
      $('#inputFileName').css({'border':'solid 1px green'}).addClass('success');
      $('.modal p.message').show().addClass('success').html('OK');
      let section = $('#selectFileSection').val();
      if(null != section && $('#inputFileName').hasClass('success')){
        $('.saveRegister4bulkUpload').prop('disabled', false);
      }
    }
    else if(null == name){
      // console.log('OK');
      $('#inputFileName').css({'border':'solid 1px red'}).removeClass('success');
      $('.modal p.message').show().removeClass('success').addClass('danger').html('Campo obligatorio');
      $('#inputFileName').val('').focus();
      $('.saveRegister4bulkUpload').prop('disabled', true);
    }
    else {
      // console.log("element found");
      $('#inputFileName').css({'border':'solid 1px red'}).removeClass('success');
      $('.modal p.message').show().removeClass('success').addClass('danger').html('El registro ya existe!');
      $('#inputFileName').focus();
      $('.saveRegister4bulkUpload').prop('disabled', true);
    }
  }
  $('#selectFileSection').change(function(){
    let sctn = $(this).val();
    $('#addNewFileFormat').find('.ndd').each(function (i, el){
      $(this).prop('disabled', false);
      $('#'+$(this).attr('id')+' option').each(function(){
        $(this).removeAttr('selected');
        $('.na').remove();
      });
    });
    if($('#inputFileName').hasClass('success')){
      $('.saveRegister4bulkUpload').prop('disabled', false);
    }
    if(sctn == 'defCts' || sctn=='defCrs'){
      $('#AddJk2bulkUploadTxt').hide();
      $('#chk2mkJk').attr('class','btn btn-default form-control').attr('value','N/A');
      $('#chk2mkJk i').attr('class','state-icon glyphicon glyphicon-unchecked');
      $('#inputJkName').val('N/A');
      $('#cols, #format').append('<option value="N/A" class="na" selected>N/A</option>').prop('disabled', true);
    }else if(sctn=='cts'||sctn=='crs'||sctn=='div'||sctn=='mon'||sctn=='tip'){
      $('#AddJk2bulkUploadTxt').show();
      $('input#inputJkName').val('');
    }else{
      $('#AddJk2bulkUploadTxt').hide();
      $('#chk2mkJk').attr('class','btn btn-default form-control').attr('value','N/A');
      $('#chk2mkJk i').attr('class','state-icon glyphicon glyphicon-unchecked');
      $('#inputJkName').val('N/A');
    }
  });
  $('#format').change(function(){
    let frmtVal = $(this).val();
    if(frmtVal=='horizontal'){
      $('#cols').append('<option value="N/A" class="na" selected>N/A</option>').prop('disabled', true);
    }
    else{$('#cols').html('').html('<option value="2"> 2 </option><option value="3"> 3 </option><option value="4"> 4 </option><option value="5"> 5 </option><option value="6"> 6 </option><option value="7"> 7 </option>').prop('disabled', false)}
  });

  function openModal(modal){
    var fileName = DB.mantenimiento.bulkUploadTxt.keyFileNames;
    fileName = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: fileName
    });
    $('#inputFileName').typeahead({
      hint: true,
      highlight: true,
      minLength: 1 /* Desde cuantos caracteres quieres que empiece la coincidencia ??? */
    },{
      name: 'fileName',
      source: fileName
    });
    $(modal).on('show', function(){
      console.log('hola');
      $('#inputFileName').focus(1000);
    });
    $(modal).modal({
      show: true
    });
  }

  // Setup listeners.
  var dropZone = document.getElementById('drop_zone');
  dropZone.addEventListener("dragover", function(e){
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  },false);

  dropZone.addEventListener('drop',function(e){
    e.preventDefault();
    e.stopPropagation();

    var files  = e.dataTransfer.files;
    var output = [];
    var items  = files.length;
    for(var i in files){
      if(i<=items){
        let f = files[i];
        let name = f.name,
        type = f.type,
        size = f.size,
        modf = (f.lastModifiedDate)?f.lastModifiedDate.toLocaleDateString():'';
        getAsText(f);
        output.push('<li><strong> '+name+' </strong> ('+size+' bytes, última modificación: '+modf+')</li>');}
    }
    $('#list').html('<ul>' + output.join('') + '</ul>');
  },false);
});
function getAsText(fileToRead) {
	var reader = new FileReader();
	reader.onload = loadHandler;
	reader.onerror = errorHandler;
	reader.readAsText(fileToRead);
}
function loadHandler(e) {
	var dataTxt = e.target.result;
	processData(dataTxt);
}
function errorHandler(evt) {
	if(evt.target.error.name == "NotReadableError") {
		alert("Canno't read file !");
	}
}
function processData(txt) {
  var allTextLines = txt.split(/\r\n|\n/);
  var lines = [];
  while (allTextLines.length){
    lines.push(allTextLines.shift().split(','));
  }
  /*
    aqui es donde se van a procesar los archivos
    uno por uno dependiendo de su registro en el objeto...
  */
	console.log(lines);
}

$('.button-checkbox').each(function(){
  // Settings
  let widget = $(this),
      button = widget.find('button'),
      checkbox = widget.find('input:checkbox'),
      color = button.data('color'),
      settings = {
        on: {
          icon: 'glyphicon glyphicon-check'
        },
        off: {
          icon: 'glyphicon glyphicon-unchecked'
        }
      };
  // Event Handlers
  button.on('click', function () {
    checkbox.prop('checked', !checkbox.is(':checked'));
    checkbox.triggerHandler('change');
    updateDisplay();
  });
  checkbox.on('change', function () {
    updateDisplay();
  });

  // Actions
  function updateDisplay() {
    var isChecked = checkbox.is(':checked');
    button.data('state', (isChecked) ? "on" : "off");
    button.find('.state-icon').removeClass().addClass('state-icon ' + settings[button.data('state')].icon);
    if (isChecked) {
      button.removeClass('btn-default').addClass('btn-' + color + ' active').attr('value','SI');
    }else{
      button.removeClass('btn-' + color + ' active').addClass('btn-default').attr('value','NO');
    }
  }
  function initCheck() {
    updateDisplay();
    if (button.find('.state-icon').length === 0) {
      button.prepend('<i class="state-icon ' + settings[button.data('state')].icon + '"></i> ');
    }
  }
  initCheck();
});
