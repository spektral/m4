var ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var CYLINDER_SETTINGS = {
    'I':       'EKMFLGDQVZNTOWYHXUSPAIBRCJ',
    'II':      'AJDKSIRUXBLHWTMCQGZNPYFVOE',
    'III':     'BDFHJLCPRTXVZNYEIWGAKMUSQO',
    'IV':      'ESOVPZJAYQUIRHXLNFTGKDCMWB',
    'V':       'VZBRGITYUPSDNHLXAWMJQOFECK',
    'VI':      'JPGVOUMFYQBENHZRDKASXLICTW',
    'VII':     'NZJHGRCXMYSWBOUFAIVLPEKQDT',
    'VIII':    'FKQHTLXOCBJSPDZRAMEWNIUYGV',
    'Beta':    'LEYJVCNIXWPBQMDRTAKZGFUHOS',
    'Gamma':   'FSOKANUERHMBTIYCWLQPZXVGJD',
    'A':       'EJMZALYXVBWFCRQUONTSPIKHGD',
    'B':       'YRUHQSLDPXNGOKMIEBFZCWVJAT',
    'C':       'FVPJIAOYEDRZXWGCTKUQSBNMHL',
    'b':       'ENKQAUYWJICOPBLMDXZVFTHRGS',
    'c':       'RDOBJNTKVEHMLFCWZAXGYIPSUQ',
    'DEBUG':   'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
};
var TURNOVER_NOTCHES = {
    'I':    'Q',
    'II':   'E',
    'III':  'V',
    'IV':   'J',
    'V':    'Z',
    'VI':   'ZM',
    'VII':  'ZM',
    'VIII': 'ZM',
};

class Plugboard
{
    constructor() {
        this.connectors = new Array(ALPHABET.length);
        for (var i = 0; i < this.connectors.length; i++)
        {
            this.connectors[i] = i;
        }
    }

    connect(connector_a, connector_b) {
        var index_a = char_to_index(connector_a);
        var index_b = char_to_index(connector_b);

        this.connectors[index_a] = index_b;
        this.connectors[index_b] = index_a;
    }

    substitute(index) {
        var output =  this.connectors[char_to_index(index)];

        var index_s = index_to_char(index);
        var output_s = index_to_char(output);

        console.info(`Plugboard: ${index_s}(${index}) -> ${output_s}(${output})`);

        return output;
    }

    print_configuration() {
        var conf = 'Plugboard conf: ';
        for (var i = 0; i < ALPHABET.length; i++) {
            conf += (index_to_char(i) + index_to_char(this.connectors[i]) + ' ');
        }
        console.info(conf)
    }
}

class Rotor
{
    constructor(type) {
        this.type = type;
        this.setting = 0;
        this.ring_setting = 0;
        this.connections_rh = new Array(ALPHABET.length);
        this.connections_lh = new Array(ALPHABET.length);
        for (var i = 0; i < ALPHABET.length; i++) {
            this.connections_rh[i] =
                ALPHABET.indexOf(CYLINDER_SETTINGS[this.type][i]);
            this.connections_lh[i] =
                CYLINDER_SETTINGS[this.type].indexOf(ALPHABET[i]);
        }
    }

    increment_setting() {
        this.setting += 1;
        if (this.setting >= ALPHABET.length) { this.setting -= ALPHABET.length };
    }

    decrement_setting() {
        this.setting -= 1;
        if (this.setting < 0) { this.setting += ALPHABET.length };
    }

    get_setting_int() {
        return this.setting;
    }

    get_setting_char() {
        return String.fromCharCode(this.setting + 65);
    }

    substitute_rh(index) {
        var in_offset = index + char_to_index(this.setting) - this.ring_setting;
        if (in_offset < 0) {
            in_offset += ALPHABET.length;
        }
        else if (in_offset >= ALPHABET.length) {
            in_offset -= ALPHABET.length;
        }

        var substitution = this.connections_rh[in_offset];

        var output = substitution - char_to_index(this.setting) + this.ring_setting;
        if (output >= ALPHABET.length) {
            output -= ALPHABET.length;
        }
        else if (output < 0) {
            output += ALPHABET.length;
        }

        var index_s = index_to_char(index);
        var in_offset_s = index_to_char(in_offset);
        var subst_s = index_to_char(substitution);
        var output_s = index_to_char(output);
        console.info(`${this.type}[${this.setting}]: ${index_s}(${index}) -> ${in_offset}(${in_offset_s}) -> ${subst_s}(${substitution}) -> ${output_s}(${output})`);

        return output;
    }

    substitute_lh(index) {
        var in_offset = index + char_to_index(this.setting) - this.ring_setting;
        if (in_offset >= ALPHABET.length) {
            in_offset -= ALPHABET.length;
        }
        else if (in_offset < 0) {
            in_offset += ALPHABET.length;
        }

        var substitution = this.connections_lh[in_offset];

        var output = substitution - char_to_index(this.setting) + this.ring_setting;
        if (output >= ALPHABET.length) {
            output -= ALPHABET.length;
        }
        else if (output < 0) {
            output += ALPHABET.length;
        }

        var index_s = index_to_char(index);
        var in_offset_s = index_to_char(in_offset_s);
        var subst_s = index_to_char(substitution);
        var output_s = index_to_char(output);
        console.info(`${this.type}[${this.setting}]: ${index_s}(${index}) -> ${in_offset}(${in_offset_s}) -> ${subst_s}(${substitution}) -> ${output_s}(${output})`);

        return output;
    }

    is_at_stepover() {
        var notches = TURNOVER_NOTCHES[this.type];

        for (var i = 0; i < notches.length; i++) {
            if (this.get_setting_char() == notches[i]) {
                return true;
            }
        }
        return false;
    }
}

function index_to_char(index)
{
    if (typeof index == "string") {
        return index;
    }

    return String.fromCharCode(index + 65);
}

function char_to_index(char)
{
    if (typeof char == "number") {
        return char;
    }

    return char.charCodeAt(0) - 65;
}

function configure() {
    reflector.type = document.getElementById("reflector").value;

    rotors[0].type = document.getElementById("rotor1").value;
    rotors[1].type = document.getElementById("rotor2").value;
    rotors[2].type = document.getElementById("rotor3").value;
    rotors[3].type = document.getElementById("rotor4").value;

    rotors[0].ring_setting = char_to_index(document.getElementById("ringset1").value);
    rotors[1].ring_setting = char_to_index(document.getElementById("ringset2").value);
    rotors[2].ring_setting = char_to_index(document.getElementById("ringset3").value);
    rotors[3].ring_setting = char_to_index(document.getElementById("ringset4").value);

    console.info(reflector);
    console.info(rotors[0]);
    console.info(rotors[1]);
    console.info(rotors[2]);
    console.info(rotors[3]);

    keep_lamp_on = document.getElementById("keeplamp").checked;
}

function update_rotor_windows()
{
    var rotor_windows = document.getElementsByClassName("rotorwindow");
    for (var i = 0; i < rotor_windows.length; i++) {
        var rotor = rotors[i];
        rotor_windows[i].innerHTML = rotor.get_setting_char();
    }
}

function update_plugboard()
{
    for (var i = 0; i < ALPHABET.length; i++) {
        item = document.getElementById("plug" + index_to_char(i));
        if (plugboard.connectors[i] != i) {
            item.className = "plugplugged";
            item.innerHTML = index_to_char(i) + index_to_char(plugboard.connectors[i]);
        }
        else {
            item.className = "plug";
            item.innerHTML = index_to_char(i);
        }
    }
}

function on_rotorup(index) {
    rotors[index].increment_setting();
    update_rotor_windows();
}

function on_rotordown(index) {
    rotors[index].decrement_setting();
    update_rotor_windows();
}

function on_keyrelease() {
    if (keep_lamp_on == false) {
        console.info("Resetting lamps.");
        var litlamps = document.getElementsByClassName('lampboardlamplit');
        for (var i = 0; i < litlamps.length; i++) {
            var item = litlamps[i];
            item.className = 'lampboardlamp';
        }
    } else {
        console.info("Keeping lamps on.");
    }
}

function rotate_rotors()
{
    if (rotors[2].is_at_stepover()) {
        rotors[1].increment_setting();
    }
    if (rotors[3].is_at_stepover() || rotors[2].is_at_stepover()) {
        rotors[2].increment_setting();
    }
    rotors[3].increment_setting();

    var cw = document.getElementsByClassName("rotorwindow");
    for (var i = 0; i < cw.length; i++) {
        cw[i].innerHTML = rotors[i].get_setting_char();
    }
}

function on_kb_mousedown(id) {
    // Play audio
    var audio = document.getElementById("keypressaudio");
    audio.play();

    rotate_rotors();

    index = char_to_index(id);
    index = plugboard.substitute(index);
    index = rotors[3].substitute_rh(index);
    index = rotors[2].substitute_rh(index);
    index = rotors[1].substitute_rh(index);
    index = rotors[0].substitute_rh(index);
    index = reflector.substitute_rh(index);
    index = rotors[0].substitute_lh(index);
    index = rotors[1].substitute_lh(index);
    index = rotors[2].substitute_lh(index);
    index = rotors[3].substitute_lh(index);
    index = plugboard.substitute(index);

    // Update lamps
    var litlamps = document.getElementsByClassName('lampboardlamplit');
    for (var i = 0; i < litlamps.length; i++) {
        var item = litlamps[i];
        item.className = 'lampboardlamp';
    }
    var lampid = 'lamp' + index_to_char(index);
    var lamp = document.getElementById(lampid);
    lamp.className = 'lampboardlamplit';

    input_char = index_to_char(id);
    output_char = index_to_char(index);
    input_item = document.getElementById("notepadin");
    output_item = document.getElementById("notepadout");
    input_item.innerHTML += input_char;
    output_item.innerHTML += output_char;
    if ((input_item.innerHTML.length + 1) % 5 == 0) {
        input_item.innerHTML += " ";
    }
    if ((output_item.innerHTML.length + 1) % 5 == 0) {
        output_item.innerHTML += " ";
    }
}

function on_plug_mousedown(id) {
    var index = char_to_index(id.replace('plug', ''));
    var index_s = index_to_char(index);
    console.info(`${index_s}(${index})`);

    if (plugboard.connectors[index] != index) {
        /* Clicked plug already connected, reset connection */
        var index_a = index;
        var index_b = plugboard.connectors[index];
        plugboard.connectors[index_a] = index_a;
        plugboard.connectors[index_b] = index_b;
        selected_plug = null;
    }
    else {
        if (selected_plug == null) {
            selected_plug = index;
        }
        else {
            plugboard.connect(selected_plug, index);
            selected_plug = null;
        }
    }

    update_plugboard();
}

function on_load()
{
    reflector = new Rotor("b");
    rotors = new Array();
    rotors.push(new Rotor("Beta"));
    rotors.push(new Rotor("I"));
    rotors.push(new Rotor("II"));
    rotors.push(new Rotor("III"));
    plugboard = new Plugboard();
    keep_lamp_on = false;

    selected_plug = null;

    var kb_layout = "QWERTZUIOASDFGHJKPYXCVBNML"

    for (var i = 0; i < ALPHABET.length; i++)
    {
        var char = index_to_char(i);
        var n = ("0" + (i + 1)).slice(-2);
        document.getElementById("ringset1").innerHTML += `<option value=${char}>${char} (${n})</option>`;
        document.getElementById("ringset2").innerHTML += `<option value=${char}>${char} (${n})</option>`;
        document.getElementById("ringset3").innerHTML += `<option value=${char}>${char} (${n})</option>`;
        document.getElementById("ringset4").innerHTML += `<option value=${char}>${char} (${n})</option>`;
    }

    items = document.getElementsByClassName("lampboardlamp");
    for (var i = 0; i < items.length; i++) {
        items[i].id = "lamp" + kb_layout[i];
        items[i].innerHTML = kb_layout[i];
    }

    items = document.getElementsByClassName("keyboardkey");
    for (var i = 0; i < items.length; i++) {
        items[i].id = "kb" + kb_layout[i];
        items[i].innerHTML = kb_layout[i];
        items[i].onmousedown = function () {
            on_kb_mousedown(this.innerHTML);
        }
    }

    items = document.getElementsByClassName("plug");
    for (var i = 0; i < items.length; i++) {
        items[i].id = "plug" + kb_layout[i];
        items[i].innerHTML = index_to_char(i);
        items[i].onmousedown = function() {
            on_plug_mousedown(this.id);
        }
    }

    document.getElementById("notepadin").innerHTML = '';
    document.getElementById("notepadout").innerHTML = '';

    plugboard.print_configuration();

    configure();
    update_rotor_windows();
    update_plugboard();
}