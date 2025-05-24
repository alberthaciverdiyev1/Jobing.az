<?php

namespace Modules\Web\Http\Controllers;

use Illuminate\Http\Request;

class WebController
{
    public function home()
    {
        return view('web::home.index');
    }

    public function about()
    {
        return view('web::about.index');
    }

    public function contact()
    {
        return view('web::contact.index');
    }

    public function faq()
    {
        return view('web::about.faq');
    }

    public function blogs()
    {
        return view('web::blog.list');
    }

    public function blog($slug)
    {
        return view('web::blog.details');
    }

    public function vacancies()
    {
        return view('web::vacancy.list');
    }

    public function vacancy($slug)
    {
        return view('web::vacancy.details');
    }

    public function addVacancy(Request $request)
    {
        if ($request->isMethod('post')) {
            $data = $request->all();
        } else {
            return view('web::vacancy.add');
        }
    }
}
