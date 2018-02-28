$(function(){
  var action=null;
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
          aaa:{
            cols:"3",
            crearEdo:"N/A",
            estado:"N/A",
            format:"keyValue",
            section:"hmlgdsCtas",
            splitedBy:"tab",
            type:"txt"
          },
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
            crearEdo:'N/A',
            estado:'N/A'
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
            type: 'csv',
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
    $('button').on('click',function(e){
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
            let o2e      = DB.mantenimiento.bulkUploadTxt.table[btnRel.rel];
            let section  = (o2e['section'])? DB.mantenimiento.bulkUploadTxt.catalogoAdd[o2e['section']]:'';
            (o2e.estado !='N/A')?$('#edit_AddJk2bulkUploadTxt').show():$('#edit_AddJk2bulkUploadTxt').hide();
            let edo      = (o2e.estado   !='N/A')?o2e.estado:'N/A';
            let crearEdo = (o2e.crearEdo =='N/A')?'<button type="button" class="btn form-control btn-default" id="chk2mkJk" value="N/A" data-color="success"><i class="state-icon glyphicon glyphicon-unchecked"></i>&nbsp;¿Crear jerarquía?</button><input type="checkbox" class="hidden">':(o2e.crearEdo =='SI')?'<button type="button" class="btn form-control btn-success active" id="chk2mkJk" value="SI" data-color="success"><i class="state-icon glyphicon glyphicon-check"></i>&nbsp;¿Crear jerarquía?</button><input type="checkbox" class="hidden">':'<button type="button" class="btn form-control btn-default" id="chk2mkJk" value="NO" data-color="success"><i class="state-icon glyphicon glyphicon-unchecked"></i>&nbsp;¿Crear jerarquía?</button><input type="checkbox" class="hidden">';
            let type     = (o2e.type != 'txt')?$('#edit_type').val('csv').change():$('#edit_type').val('txt').change();
            let splitedBy= $('#edit_splytedBy').val(o2e.splitedBy).change();
            let format   = (o2e.format=='N/A')?$('#edit_cols, #edit_format').append('<option value="N/A" class="na" selected>N/A</option>').prop('disabled', true):$('#edit_format').val(o2e.format).change();
            $('#edit_AddJk2bulkUploadTxt span.button-checkbox').html('').html(crearEdo).on('click',function(e){
              e.stopPropagation();
              e.preventDefault();
              e.stopImmediatePropagation();
              let widget   = $(this),
                  button   = widget.find('button'),
                  checkbox = widget.find('input:checkbox'),
                  color    = button.data('color'),
                  settings = {
                    on :{icon: 'glyphicon glyphicon-check'},
                    off:{icon: 'glyphicon glyphicon-unchecked'}
                  };
              checkbox.prop('checked', !checkbox.is(':checked'));
              checkbox.triggerHandler('change');
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
              function initCheck(){
                updateDisplay();
                if (button.find('.state-icon').length === 0) {
                  button.prepend('<i class="state-icon ' + settings[button.data('state')].icon + '"></i> ');
                }
              }
              initCheck();
              return false;
            });
            $('#edit_FileName').val('').val(btnRel.rel).attr('disabled',true);
            $('#edit_FileSection').html('').append('<option value="'+o2e['section']+'" selected>'+section+'</option>'+option.join(''));
            $('#edit_inputJkName').html('').val(edo);
            openModal('#'+toMatch+'_modal');
            return false;
          }
        }
      }
      return;
    });

  }
  buildMntoBulkUploadDirectoryTable();
/* /contruye la tabla */
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
      if(rel == 'saveReg2blkUpld' || rel=='editReg2blkUpld'){
        let idForm = (rel=='saveReg2blkUpld')?'#addNewFileFormat':'#EditFileFormat';
        let obj = {};
        $(idForm).find('.form-control').each(function (i, el){
          let key = $(this).attr('id');
          let val = $(this).val();
          if(undefined == obj[key]){
            obj[key] = '';
          }
          obj[key] = val;
        });
        delete obj[undefined];
        const guardar = new save(obj);
        console.log(guardar.save);
      }else{
        $('#addNewFileFormat')[0].reset();
        openModal('#'+rel+'_modal');
      }
      return;
    }
  });
  class save{
    constructor(obj){
      this.obj       = obj;
      this.keyName   = (undefined == obj.inputFileName)?obj.edit_FileName:obj.inputFileName;
      this.cols      = (undefined == obj.cols)?obj.edit_cols:obj.cols;
      this.format    = (undefined == obj.format)?obj.edit_format:obj.format;
      this.section   = (undefined == obj.selectFileSection)?obj.edit_FileSection:obj.selectFileSection;
      this.splitedBy = (undefined == obj.splytedBy)?obj.edit_splytedBy:obj.splytedBy;
      this.type      = (undefined == obj.type)?obj.edit_type:obj.type;
      this.estado    = (undefined == obj.inputJkName)?obj.edit_inputJkName:obj.inputJkName;
      this.crearEdo  = obj.chk2mkJk;
    }
    get save(){
      this._save();
      return('save OK');
    }
    _save(){
      var tblReg = DB.mantenimiento.bulkUploadTxt.table;
      if(undefined == tblReg[this.keyName]){
        tblReg[this.keyName] = {}
      }
      tblReg[this.keyName] = {
        cols     : this.cols,
        format   : this.format,
        section  : this.section,
        splitedBy: this.splitedBy,
        type     : this.type,
        estado   : this.estado,
        crearEdo : this.crearEdo
      }

      /*  #######################    */
      /*  aquí guardar a firebase    */
      /*  los datos de los registros */
      /*  de los archivos a subir    */
      /*  #######################    */

      $('.modal').modal('hide');
      buildMntoBulkUploadDirectoryTable();
    }
  }

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
  $('#selectFileSection, #edit_FileSection').change(function(){
    let sctn = $(this).val();
    $('#addNewFileFormat, #EditFileFormat').find('.ndd').each(function (i, el){
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
      $('#AddJk2bulkUploadTxt, #edit_AddJk2bulkUploadTxt').hide();
      $('#chk2mkJk').attr('class','btn btn-default form-control').attr('value','N/A');
      $('#chk2mkJk i').attr('class','state-icon glyphicon glyphicon-unchecked');
      $('#inputJkName, #edit_inputJkName').val('N/A');
      $('#cols, #format, #edit_cols, #edit_format').append('<option value="N/A" class="na" selected>N/A</option>').prop('disabled', true);
    }else if(sctn=='cts'||sctn=='crs'||sctn=='div'||sctn=='mon'||sctn=='tip'){
      $('#AddJk2bulkUploadTxt, #edit_AddJk2bulkUploadTxt').show();
      $('input#inputJkName, input#edit_inputJkName').val('');
    }else{
      $('#AddJk2bulkUploadTxt, #edit_AddJk2bulkUploadTxt').hide();
      $('#chk2mkJk').attr('class','btn btn-default form-control').attr('value','N/A');
      $('#chk2mkJk i').attr('class','state-icon glyphicon glyphicon-unchecked');
      $('#inputJkName, #edit_inputJkName').val('N/A');
    }
  });
  $('#format, #edit_format').change(function(){
    let frmtVal = $(this).val();
    if(frmtVal=='horizontal'){
      $('#cols, #edit_cols').append('<option value="N/A" class="na" selected>N/A</option>').prop('disabled', true);
    }
    else{$('#cols, #edit_cols').html('').html('<option value="2"> 2 </option><option value="3"> 3 </option><option value="4"> 4 </option><option value="5"> 5 </option><option value="6"> 6 </option><option value="7"> 7 </option>').prop('disabled', false)}
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
    $(modal).modal({
      show: true
    });
  }
  $('#edit_modal').on('shown.bs.modal',function(e){
    $('.saveRegister4bulkUpload').prop('disabled', false);
    $('.saveRegister4bulkUpload').attr('rel','editReg2blkUpld');
  });
  $('#addNewRegister2BulkUpload_modal').on('shown.bs.modal',function(e){
    $('.saveRegister4bulkUpload').prop('disabled', true);
    $('.saveRegister4bulkUpload').attr('rel','saveReg2blkUpld');
    $('#inputFileName').focus();
    $('#inputFileName').focusout(function(){
      let name = ($(this).val().trim())?$(this).val().trim():null;
      checkNameStatus(name);
    });
    $('.modal-footer').mouseenter(function(){
      console.log('que chow');
      let name = ($('#inputFileName').val().trim())?$('#inputFileName').val().trim():null;
      let nmJk = ($('#inputFileName').val().trim())?$('#inputFileName').val().trim():null;
      if(null==name || null == nmJk){
        $('.saveRegister4bulkUpload').prop('disabled', true);
      }
    });
  });
  // $('.saveRegister4bulkUpload').prop('disabled', true);


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
  let widget   = $(this),
      button   = widget.find('button'),
      checkbox = widget.find('input:checkbox'),
      color    = button.data('color'),
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
