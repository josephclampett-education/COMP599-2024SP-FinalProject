console.clear();

// ----------------------------------------------
// create variables used in your program
// ----------------------------------------------



// ----------------------------------------------
// camera parameters
// ----------------------------------------------
let xt = 0.5;
let yt = 0.5;
let zt = 0.5;
let fov = 45;

// ----------------------------------------------
// light parameters
// ----------------------------------------------
let lxt = 1.0;
let lyt = 1.0;
let lzt = 1.0;

// ----------------------------------------------
// orbit dynamic parameters
// ----------------------------------------------
let orbit_speed = 0;
let orbit_speed_crd = 3; 
let orbit_radius_crd = 0.65; 
let orbit_angle_crd = 45; 

// ----------------------------------------------
// camera orientation parameters
// ----------------------------------------------
let at = vec3(0.0, 0.0, 0.0);
let up = vec3(0.0, 1.0, 0.0);


// ----------------------------------------------
// Event listeners
// ----------------------------------------------

// listener for the orbit speed slider
document.getElementById("os").addEventListener("input", function (e) {
    orbit_speed_crd = parseFloat(document.getElementById("os").value);
    document.getElementById("os_crd").innerHTML = " = " + orbit_speed_crd;
});

// listener for the orbit distance slider
document.getElementById("od").addEventListener("input", function (e) {
    orbit_radius_crd = parseFloat(e.target.value);
    document.getElementById("od_crd").innerHTML = " = " + orbit_radius_crd;
});

// listener for the orbit angle slider
document.getElementById("oa").addEventListener("input", function (e) {
    orbit_angle_crd = parseFloat(document.getElementById("oa").value);
    document.getElementById("oa_crd").innerHTML = " = " + orbit_angle_crd;
});

document.getElementById("zt").addEventListener("click", function (e) {
    zt = document.getElementById("zt").value;
    document.getElementById("z_crd").innerHTML = "= " + zt;
});

document.getElementById("xt").addEventListener("click", function (e) {
    xt = document.getElementById("xt").value;
    document.getElementById("x_crd").innerHTML = "= " + xt;
});

document.getElementById("yt").addEventListener("click", function (e) {
    yt = document.getElementById("yt").value;
    document.getElementById("y_crd").innerHTML = "= " + yt;
});
document.getElementById("fov").addEventListener("click", function (e) {
    fov = document.getElementById("fov").value;
    document.getElementById("fovy").innerHTML = "= " + fov;
});

document.getElementById("lzt").addEventListener("click", function (e) {
    lzt = document.getElementById("lzt").value;
    document.getElementById("lz_crd").innerHTML = "= " + lzt;
});

document.getElementById("lxt").addEventListener("click", function (e) {
    lxt = document.getElementById("lxt").value;
    document.getElementById("lx_crd").innerHTML = "= " + lxt;
});

document.getElementById("lyt").addEventListener("click", function (e) {
    lyt = document.getElementById("lyt").value;
    document.getElementById("ly_crd").innerHTML = "= " + lyt;
});

document.getElementById("reset_cl").addEventListener("click", function (e) {
    xt = yt = zt = 0.5;
    lxt = lyt = lzt = 1.0;
    fov = 45;
    document.getElementById("xt").value = xt;
    document.getElementById("x_crd").innerHTML = "= " + xt;
    document.getElementById("yt").value = yt;
    document.getElementById("y_crd").innerHTML = "= " + yt;
    document.getElementById("zt").value = zt;
    document.getElementById("z_crd").innerHTML = "= " + zt;
    document.getElementById("fov").value = fov;
    document.getElementById("fovy").innerHTML = "= " + fov;
    document.getElementById("lxt").value = lxt;
    document.getElementById("lx_crd").innerHTML = "= " + lxt;
    document.getElementById("lyt").value = lyt;
    document.getElementById("ly_crd").innerHTML = "= " + lyt;
    document.getElementById("lzt").value = lzt;
    document.getElementById("lz_crd").innerHTML = "= " + lzt;
});

document.getElementById("reset_ss").addEventListener("click", function (e) {
    orbit_speed_crd = 3; 
    orbit_radius_crd = 0.65; 
    orbit_angle_crd = 45; 
    document.getElementById("os").value = orbit_speed_crd;
    document.getElementById("os_crd").innerHTML = " = " + orbit_speed_crd;
    document.getElementById("od").value = orbit_radius_crd;
    document.getElementById("od_crd").innerHTML = " = " + orbit_radius_crd;
    document.getElementById("oa").value = orbit_angle_crd;
    document.getElementById("oa_crd").innerHTML = " = " + orbit_angle_crd;
    draw();
});

// ----------------------------------------------
// Add your coding solution
// ----------------------------------------------

// ----------------------------------------------
// Configure web-gl context
// ----------------------------------------------
function configure() {
    
    canvas = document.getElementById( "webgl-canvas" );
    
    webgl_context = canvas.getContext( "webgl" );
    program = initShaders( webgl_context, "vertex-shader", "fragment-shader" );
    webgl_context.useProgram( program );
    
    webgl_context.viewport( 0, 0, canvas.width, canvas.height );
       
	attr_vertex = webgl_context.getAttribLocation(program, "vertex");
	attr_normal = webgl_context.getAttribLocation(program, "normal");
    
	uniform_props = webgl_context.getUniformLocation(program, "props");
	uniform_trans = webgl_context.getUniformLocation(program, "trans");
	uniform_V = webgl_context.getUniformLocation(program, "V");
	uniform_P = webgl_context.getUniformLocation(program, "P");
	uniform_light = webgl_context.getUniformLocation(program, "light");
    uniform_eye = webgl_context.getUniformLocation(program, "eye");
    uniform_color = webgl_context.getUniformLocation(program, "color");

    webgl_context.enable( webgl_context.DEPTH_TEST );
}

// ----------------------------------------------
// Create vertex data  
// ----------------------------------------------
function createVertexData() 
{
    let row = 0;
    
    for ( let i=0; i<F_p.length; i++ ) {
        
        vertex_data[row++] = V_p[ F_p[i][0] ];
        vertex_data[row++] = V_p[ F_p[i][1] ];
        vertex_data[row++] = V_p[ F_p[i][2] ];
        
    }
    
    mgs_index = vertex_data.length;
    
    for ( let i=0; i<F_s.length; i++ ) {
        
        vertex_data[row++] = V_s[ F_s[i][0] ];
        vertex_data[row++] = V_s[ F_s[i][1] ];
        vertex_data[row++] = V_s[ F_s[i][2] ];
        
    }
}

// ----------------------------------------------
// Allocate memory and load data.
// ----------------------------------------------

function allocateMemory() 
{    
    let buffer_id = webgl_context.createBuffer();
    
    webgl_context.bindBuffer( webgl_context.ARRAY_BUFFER, buffer_id );
    webgl_context.vertexAttribPointer( attr_vertex, size, webgl_context.FLOAT, false, 0, 0 );
    webgl_context.enableVertexAttribArray( attr_vertex );
    webgl_context.bufferData( webgl_context.ARRAY_BUFFER, flatten(vertex_data), webgl_context.STATIC_DRAW );
    
	let normal_id = webgl_context.createBuffer();

 	webgl_context.bindBuffer(webgl_context.ARRAY_BUFFER, normal_id);
    webgl_context.vertexAttribPointer(attr_normal, size, webgl_context.FLOAT, false, 0, 0);
    webgl_context.enableVertexAttribArray(attr_normal);
    webgl_context.bufferData(webgl_context.ARRAY_BUFFER, flatten(normal_data), webgl_context.STATIC_DRAW);
}

// ----------------------------------------------
// Run the pipeline and draw our mesh
// ----------------------------------------------
function draw() 
{
    let eye = vec3(xt, yt, zt);

    let V = lookAt(eye, at, up);
    
    let P = perspective(fov, 1.0, 0.3, 3.0);

    webgl_context.uniformMatrix4fv(uniform_V, false, flatten(V));
    webgl_context.uniformMatrix4fv(uniform_P, false, flatten(P));
    webgl_context.uniformVector4fv(uniform_eye, eye);

    let light = vec3(lxt, lyt, lzt);

    webgl_context.uniformVector4fv(uniform_light, light);

    // ==============================================
    // Camera setup
    // ==============================================

    // ==============================================
    // Render Mars
    // ==============================================

    // ==============================================
    // Render MGS
    // ==============================================
}

createVertexData();
configure();
allocateMemory();
setInterval(draw, 100);

// uniform_props = webgl_context.getUniformLocation(program, "props");
// uniform_trans = webgl_context.getUniformLocation(program, "trans");
// uniform_V = webgl_context.getUniformLocation(program, "V");
// uniform_P = webgl_context.getUniformLocation(program, "P");
// uniform_light = webgl_context.getUniformLocation(program, "light");
// uniform_eye = webgl_context.getUniformLocation(program, "eye");