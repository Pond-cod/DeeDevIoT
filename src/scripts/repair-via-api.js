const http = require('http');

const configDefaults = [
    ['hero_badge', 'TECHNOLOGY POWERHOUSE', 'พรีเมียมเทคโนโลยีโซลูชัน'],
    ['hero_headline', 'Transform Your Business with <br /> Intelligent Web & IoT Solutions', 'ยกระดับธุรกิจของคุณ <br /> ด้วยโซลูชัน WEB APP & IOT อัจฉริยะ'],
    ['hero_sub', 'Building intelligent software and hardware ecosystems.', 'จากซอฟต์แวร์จัดการบนเว็บ สู่การควบคุมบอร์ด Arduino/ESP32 ไร้รอยต่อ'],
    ['hero_btn1_text', 'Consult our Expert', 'ปรึกษาผู้เชี่ยวชาญ'],
    ['hero_btn1_link', '#contact', '#contact'],
    ['hero_btn2_text', 'See Our Portfolio', 'ดูผลงานของเรา'],
    ['hero_btn2_link', '#services', '#services'],
    ['why_badge', 'WHY CHOOSE US', 'ทำไมถึงต้องเลือกเรา'],
    ['why_choose_title', 'What Makes Us Different', 'ความแตกต่างที่ทำให้เราโดดเด่น'],
    ['why1_title', 'Domain Expertise', 'ความเชี่ยวชาญเฉพาะด้าน'],
    ['why1_desc', 'Specialized professionals in full-stack web development and IoT hardware engineering.', 'ทีมงานมืออาชีพที่มีความเชี่ยวชาญทั้งด้าน Web Development และ IoT Hardware'],
    ['why2_title', 'Agile Delivery', 'การส่งมอบที่รวดเร็ว'],
    ['why2_desc', 'Rapid deployment with flexible, on-the-fly adaptations to meet your strict deadlines.', 'พัฒนาและส่งมอบงานได้อย่างรวดเร็ว พร้อมยืดหยุ่นปรับเปลี่ยนตามความต้องการ'],
    ['why3_title', 'Cost-Effective', 'คุ้มค่าการลงทุน'],
    ['why3_desc', 'Transparent pricing with high ROI on every digital innovation you receive.', 'ราคาโปร่งใส ให้ผลตอบแทนคุ้มค่าในทุกนวัตกรรมดิจิทัลที่คุณได้รับ'],
    ['why4_title', 'Premium Support', 'บริการดูแลหลังการขาย'],
    ['why4_desc', 'Dedicated system maintenance and highly responsive technical consulting.', 'ดูแลรักษาระบบอย่างใกล้ชิด พร้อมให้คำปรึกษาทางเทคนิคอย่างรวดเร็ว'],
    ['svc_badge', 'OUR SOLUTIONS', 'โซลูชันของเรา'],
    ['solutions_title', 'Services', 'บริการ'],
    ['port_badge', 'INTEGRATIONS', 'ผลงานของเรา'],
    ['integrations_title', 'Seamless Ecosystem Connectivity', 'ทำงานร่วมกับแพลตฟอร์มอื่นอย่างไร้รอยต่อ'],
    ['port_desc', 'Enhance your workflow flawlessly by connecting our custom-built platforms with the everyday tools you already trust.', 'เพิ่มประสิทธิภาพการทำงานด้วยการเชื่อมต่อแพลตฟอร์มของเรากับเครื่องมือที่คุณคุ้นเคย'],
    ['cta_heading', 'Ready to Start Your Next Big Project?', 'พร้อมเริ่มพัฒนาโปรเจกต์ของคุณแล้วหรือยัง?'],
    ['footer_bio', 'Your trusted tech partner in turning innovative ideas into powerful, real-world Web & Hardware platforms.', 'พาร์ทเนอร์ที่พร้อมสานต่อไอเดียของคุณให้กลายเป็นแพลตฟอร์มที่ใช้งานได้จริง'],
    ['facebook_url', 'https://facebook.com/deedeviot', 'https://facebook.com/deedeviot'],
    ['nav_item1', 'Concept', 'แนวคิด'],
    ['nav_btn', 'Contact Us', 'ติดต่อเรา'],
    ['concept_title1', 'SMART', 'สมาร์ท'],
    ['concept_title2', 'GEARING', 'เกียร์ริ่ง'],
    ['concept_description', 'Our systems work in harmony like precision-engineered gears.', 'ระบบของเราทำงานร่วมกันอย่างสมบูรณ์แบบ เหมือนฟันเฟืองที่ผ่านการวิศวกรรมมาอย่างแม่นยำ'],
    ['concept_c1t', 'Precision Eng.', 'ความแม่นยำสูง'],
    ['concept_c1d', 'Every line of code and IoT component is designed for perfect harmony.', 'ทุกบรรทัดของโค้ดและส่วนประกอบ IoT ถูกออกแบบมาเพื่อความสอดคล้องที่ลงตัว'],
    ['concept_c2t', 'High Velocity', 'ความเร็วสูงสุด'],
    ['concept_c2d', 'Accelerate your business with high-performance systems.', 'เร่งสปีดธุรกิจของคุณด้วยระบบที่มีประสิทธิภาพและรวดเร็ว'],
    ['concept_c3t', 'Steady Growth', 'ความเติบโตที่มั่นคง'],
    ['concept_c3d', 'Reliable tech that ensures your business thrives consistently.', 'เทคโนโลยีที่เชื่อถือได้ เพื่อให้มั่นใจว่าธุรกิจของคุณจะเติบโตอย่างต่อเนื่อง'],
    ['contact_title', 'READY TO POWER UP?', 'พร้อมที่จะขับเคลื่อนไปข้างหน้าหรือยัง?'],
    ['contact_description', 'Our gears are ready. Let us power your success.', 'ฟันเฟืองของเราพร้อมแล้ว ให้เราเป็นส่วนหนึ่งในความสำเร็จของคุณ'],
    ['contact_facebook', 'DeeDevIOT Page', 'เพจ DeeDevIOT'],
    ['contact_email', 'hello@deedeviot.com', 'hello@deedeviot.com'],
    ['contact_phone', '02-123-4567', '02-123-4567'],
    ['contact_line', '@DEEDEVIOT', '@DEEDEVIOT'],
];

const payload = {};
configDefaults.forEach(([key, en, th]) => {
    payload[`${key}_en`] = en;
    payload[`${key}_th`] = th;
});

const data = Buffer.from(JSON.stringify(payload), 'utf8');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/config',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
});

req.on('error', (e) => {
    console.error(`ERROR: ${e.message}`);
    process.exit(1);
});

req.write(data);
req.end();
